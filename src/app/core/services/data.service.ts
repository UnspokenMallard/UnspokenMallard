import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import size from "lodash-es/size";
import { LocalStorage, LocalStorageService } from "ngx-store";
import { forkJoin, iif, Observable, of, throwError } from "rxjs";
import { catchError, map, mergeMap, concatMap, bufferCount, tap } from "rxjs/operators";
import { ENVIRONMENT, Environment } from "src/app/app.module";
import { UserService } from "./user.service";
import { UtilsService } from "./utils.service";

enum Origin {
  Source = "source",
  Target = "target",
}

@Injectable({ providedIn: "root" })
export class DataService implements Resolve<[Core.SelectableItem<Language.Result>[], Link.Result[], Core.SelectableItem<Dictionary.Result>[]]> {
  sourceDictionaries: Core.SelectableItem<Dictionary.Result>[] = [];
  targetDictionaries: Core.SelectableItem<Dictionary.Result>[] = [];
  // Additional search parameters
  sourceDict!: string;
  targetLanguage!: string;
  targetDict!: string;
  similarity!: string;
  targetLanguages: Core.SelectableItem<Language.Result>[] = [];
  @LocalStorage() private languages: Core.SelectableItem<Language.Result>[] = [];
  @LocalStorage() private dictionaries: Core.SelectableItem<Dictionary.Result>[] = [];
  @LocalStorage() private links: Link.Result[] = [];
  private cachedDictionaries: Map<string, Dictionary.Result> = new Map<string, Dictionary.Result>();
  private readonly apiUrl: API.URL;
  private readonly apikey: API.Key;
  private readonly email: API.Email;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private utils: UtilsService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    @Inject(ENVIRONMENT) environment: Environment,
  ) {
    this.apiUrl = environment?.api?.clientUrl ?? "";
    this.email = environment?.api?.email ?? "";
    this.apikey = environment?.api?.apiKey ?? "";
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[Core.SelectableItem<Language.Result>[], Link.Result[], Core.SelectableItem<Dictionary.Result>[]]> {
    return forkJoin([this.listLanguages$(route), this.listLinks$(route), this.listDictionaries$({}, route)]).pipe(
      catchError(() => {
        return of([this.languages, this.links, this.dictionaries]) as Observable<[Core.SelectableItem<Language.Result>[], Link.Result[], Core.SelectableItem<Dictionary.Result>[]]>;
      }),
    );
  }

  listLinks$(route: ActivatedRouteSnapshot): Observable<Link.Result[]> {
    const pathParameters = route.params as Link.Parameters;
    if (isEmpty(pathParameters)) return of([]);
    let parameters = {...pathParameters} as Link.Parameters;
    const {sourceDict, targetLanguage, targetDict, similarity} = route.queryParams;
    if (!!sourceDict) {
      parameters.sourceDict = sourceDict;
    }
    if (!!targetLanguage) {
      parameters.targetLanguage = targetLanguage;
    }
    if (!!targetDict) {
      parameters.targetDict = targetDict;
    }
    if (!!similarity) {
      parameters.similarity = similarity;
    }
    this.localStorage.remove("links");
    return this.fetchLinks$({...pathParameters}).pipe(
      mergeMap((results: Link.RawResult[]) => {
        return iif(() => isEmpty(results), throwError(() => new Error("No links were found")), of(results))
      }),
      mergeMap((results: Link.RawResult[]) => {
        const bufferSize = size(results);
        return of(results).pipe(
          concatMap((links) => links),
          concatMap((link: Link.RawResult) => {
            return iif(
              () => !!link.sourceDictConcept,
              this.fetchSupportingLinks$(link, Origin.Source),
              this.updateLanguageLabel$(link, Origin.Source)
            );
          }),
          concatMap((link: Link.RawResult) => {
            return iif(
              () => !!link.targetDictConcept,
              this.fetchSupportingLinks$(link, Origin.Target),
              this.updateLanguageLabel$(link, Origin.Target)
            );
          }),
          map((link: Link.RawResult) => {
            const result: Link.Result = {
              source: [],
              target: []
            };
            if (!!link.sourceConnectedLinks) {
              result.source = link.sourceConnectedLinks.map((link) => {
                return this.transformToSourceLink(link);
              });
            } else {
              result.source = [this.transformToSourceLink(link)];
            }
            // Transform it to meta data for dictionary, due to the fact it's lost otherwise
            result.concept = this.transformToTargetLink(link)
            if (!!link.targetConnectedLinks) {
              result.target = link.targetConnectedLinks.map((childLink) => {
                return this.transformToTargetLink(childLink);
              });
            } else {
              result.target = [this.transformToTargetLink(link)];
            }
            return result;
          }),
          bufferCount(bufferSize)
        );
      }),
      tap((links) => {
        this.links = links;
      }),
    );
  }

  listDictionaries$(parameters: Dictionary.Parameters = {}, route: ActivatedRouteSnapshot): Observable<Core.SelectableItem<Dictionary.Result>[]> {
    if (this.utils.isObjectEmpty(parameters) && !isEmpty(this.dictionaries)) {
      return of(this.dictionaries).pipe(
        tap((dictionaries) => {
          this.dictionaries = dictionaries;
          const {sourceDict, targetDict } = route.queryParams;
          this.sourceDictionaries = !!sourceDict ? dictionaries.map((item) => {
            item.selected = item.value.id === sourceDict;
            return item;
          }) : dictionaries;
          this.targetDictionaries = !!targetDict ? dictionaries.map((item) => {
            item.selected = item.value.id === targetDict;
            return item;
          }) : dictionaries;
        })
      );
    }
    return this.httpClient.post<Dictionary.ListResults>(this.apiUrl + "/api/listDict", {...parameters, ...this.defaultParameters}).pipe(
      map(({success, dictionaries, cached = false}) => {
        let results = success ? dictionaries : [];
        if (cached && results.length > 0 && !this.utils.isObjectEmpty(parameters)) {
          if (!!parameters.lang) {
            results = results.filter((dictionary) => {
              return dictionary.language === parameters.lang;
            });
          }
          if (!!parameters.withLinks) {
            results = results.filter((dictionary) => {
              return dictionary.hasLinks === parameters.withLinks;
            });
          }
        }
        return results;
      }),
      tap((dictionaries) => {
        if (this.utils.isObjectEmpty(parameters)) {
          for (const dictionary of dictionaries) {
            this.cachedDictionaries.set(dictionary.id, dictionary);
          }
        }
      }),
      map((dictionaries) => {
        return dictionaries.map((dictionary) => {
          return {
            label: dictionary.title ?? '',
            value: dictionary,
            selected: false,
          }
        });
      }),
      tap((dictionaries) => {
        this.dictionaries = dictionaries;
        const {sourceDict, targetDict} = route.queryParams;
        this.sourceDictionaries = !!sourceDict ? dictionaries.map((item) => {
          item.selected = item.value.id === sourceDict;
          return item;
        }) : dictionaries;
        this.targetDictionaries = !!targetDict ? dictionaries.map((item) => {
          item.selected = item.value.id === targetDict;
          return item;
        }) : dictionaries;
      })
    );
  }

  searchDictionaries$(query: string): Observable<Dictionary.Result[]> {
    return this.listDictionaries$({}, this.route.snapshot).pipe(
      map((dictionaries) => {
        return dictionaries.filter(({label}) => {
          return label.includes(query);
        });
      }),
      map((dictionaries) => {
        return dictionaries.map(({value}) => {
          return value;
        });
      })
    )
  }

  findDictionaryByID$(query: string): Observable<Dictionary.Result | {}> {
    if (this.cachedDictionaries.has(query)) {
      return of(this.cachedDictionaries.get(query) || {}) as Observable<Dictionary.Result | {}>;
    }
    return this.listDictionaries$({}, this.route.snapshot).pipe(
      map((dictionaries) => {
        return dictionaries.find(({id}) => {
          return id === query;
        }) || {};
      }),
      tap((dictionary) => {
        if (this.utils.isDictionary(dictionary)) {
          this.cachedDictionaries.set(dictionary.id, dictionary);
        }
      }),
      catchError(() => of({})),
    )
  }

  listLanguages$(route: ActivatedRouteSnapshot): Observable<Core.SelectableItem<Language.Result>[]> {
    if (this.languages.length > 0) {
      const {targetLanguage} = route.queryParams;
      this.targetLanguages = !!targetLanguage ? this.languages.map((item) => {
        item.selected = item.value.code === targetLanguage;
        return item;
      }) : this.languages;
      return of(this.languages);
    }
    return this.httpClient.post<Language.ListResults>(this.apiUrl + "/api/listLang", this.defaultParameters ).pipe(
      map((response) => {
        const {success, languages} = response as unknown as Language.ListResults
        return success ? languages.map((item) => {
          item.title = item.language ?? item.code;
          return {
            label: item.title,
            selected: false,
            value: item,
          };
        }) : [];
      }),
      tap((languages) => {
        const {targetLanguage} = route.queryParams;
        this.languages = languages;
        this.targetLanguages = !!targetLanguage ? languages.map((item) => {
          item.selected = item.value.code === targetLanguage;
          return item;
        }) : languages;
      }),
      catchError(() => of([])),
    );
  }

  findLanguage$(code: string) {
    return this.listLanguages$(this.route.snapshot).pipe(
      map((languages) => {
        return languages.find((language) => language.value.code === code);
      })
    );
  }

  private fetchSupportingLinks$(link: Link.RawResult, origin: Origin) {
    const parameters = {
      headword: get(link, origin + "Headword"),
      sourceDict: get(link, origin + "Dict"),
      sourceLanguage: get(link, origin + "Lang"),
    };
    return this.fetchLinks$(parameters).pipe(
      concatMap((supportingLinks: Link.RawResult[]) => {
        return this.updateLanguageLabels$(supportingLinks, origin);
      }),
      map((links) => {
        set(link, origin + "ConnectedLinks", links);
        return link;
      })
    );
  }

  private updateLanguageLabel$(link: Link.RawResult, origin: Origin) {
    return this.findLanguage$(get(link, origin + "Lang")).pipe(
      map((language) => {
        set(link, origin + "LanguageObj", language);
        return link;
      })
    );
  }

  private updateLanguageLabels$(links: Link.RawResult[], origin: Origin) {
    return forkJoin(links.map((link) => this.updateLanguageLabel$(link, origin)));
  }

  private transformToSourceLink(link: Link.RawResult): Link.FormattedResult {
    return {
      id: link.sourceID,
      collection: {
        link: link.sourceURL,
        name: link.sourceDict
      },
      dictTitle: link.sourceDictTitle,
      description: link.sourceDescription,
      term: link.sourceHeadword,
    };
  }

  private transformToTargetLink(link: Link.RawResult): Link.FormattedResult {
    return {
      id: link.targetID,
      collection: {
        link: link.targetURL,
        name: link.targetDict
      },
      dictTitle: link.targetDictTitle,
      description: link.targetDescription,
      term: link.targetHeadword,
      similarity: link.targetSimilarity,
    };
  }

  private fetchLinks$(parameters: Link.Parameters): Observable<Link.RawResult[]> {
    return this.httpClient
      .post<Link.ListResults>(this.apiUrl + "/api/listLinks", {
        ...parameters,
        ...this.defaultParameters,
      })
      .pipe(
        map(({ success, links }) => {
          return success ? links : [];
        }),
        catchError(() => of([]))
      ) as Observable<Link.RawResult[]>;
  }

  private get defaultParameters(): Core.Parameters {
    if (this.userService.isLogged()) {
      const info = this.userService.profile as User.Information;
      return {
        email: info.email,
        apikey: info.apiKey,
      };
    } else {
      return {
        email: this.email,
        apikey: this.apikey
      };
    }
  }
}
