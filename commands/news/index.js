module.exports = {
	Name: "news",
	Aliases: null,
	Author: "supinic",
	Cooldown: 10000,
	Description: "Fetches short articles. You can use a 2 character ISO code to get country specific news, or any other word as a search query.",
	Flags: ["mention","non-nullable","pipe"],
	Params: null,
	Whitelist_Response: null,
	Static_Data: (() => ({
		codeRegex: /^[a-z]{2}$/i,

		definitions: [
			{
				code: "fi",
				language: "finnish",
				sources: [
					{
						name: "High",
						url: "https://high.fi",
						path: "kotimaa",
						endpoints: ["rss"],
						helpers: ["kalastelija01", "leppunen"]
					}
				]
			},
			{
				code: "vn",
				language: "vietnamese",
				sources: [
					{
						name: "VietNamNet",
						url: "https://vietnamnet.vn",
						path: "rss",
						endpoints: ["thoi-su.rss", "tuanvietnam.rss"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "ug",
				language: "swahili",
				sources: [
					{
						name: "Bukedde Online",
						url: "https://www.bukedde.co.ug",
						path: "feed",
						endpoints: ["rss"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "es",
				language: "spanish",
				sources: [
					{
						name: "ABC",
						url: "https://www.abc.es",
						path: "rss/feeds",
						endpoints: [
							"abc_Economia.xml",
							"abc_opinioncompleto.xml",
							"abc_Cultura.xml",
							"abc_EspanaEspana.xml",
							"abcPortada.xml"
						],
						helpers: []
					}
				]
			},
			{
				code: "cl",
				language: "spanish",
				sources: [
					{
						name: "Copperativa",
						url: "https://www.cooperativa.cl",
						path: "noticias/site/tax/port",
						endpoints: ["all/rss____1.xml"],
						helpers: ["namtheweebs"]
					}
				]
			},
			{
				code: "is",
				language: "icelandic",
				sources: [
					{
						name: "RÚV",
						url: "https://www.ruv.is",
						path: "rss",
						endpoints: ["frettir", "innlent", "erlent"],
						helpers: ["kawaqa"]
					}
				]
			},
			{
				code: "rs",
				language: "serbian",
				sources: [
					{
						name: "N1 Info",
						url: "https://rs.n1info.com",
						path: "rss",
						endpoints: ["249/Naslovna"],
						helpers: ["supinic", "infinitegachi"]
					}
				]
			},
			{
				code: "dk",
				language: "danish",
				sources: [
					{
						name: "Ekstra Bladet",
						url: "https://ekstrabladet.dk",
						path: "rssfeed",
						endpoints: ["all", "nyheder"],
						helpers: ["gubbyfish"]
					},
					{
						name: "DR",
						url: "https://www.dr.dk/nyheder/service",
						path: "feeds",
						endpoints: ["indland", "regionale"],
						helpers: []
					}
				]
			},
			{
				code: "ee",
				language: "estonian",
				sources: [
					{
						name: "Postimees",
						url: "https://www.postimees.ee",
						path: null,
						endpoints: ["rss"],
						helpers: ["slordniir"]
					}
				]
			},
			{
				code: "mt",
				language: "maltese",
				sources: [
					{
						name: "TVM",
						url: "https://www.tvm.com.mt/mt",
						path: null,
						endpoints: ["feed"],
						helpers: ["trollpotat0"]
					}
				]
			},
			{
				code: "by",
				language: "belarusian",
				sources: [
					{
						name: "Charter 97",
						url: "https://charter97.org/be",
						path: "rss",
						endpoints: ["all"],
						helpers: ["karylul", "gw_ua"]
					}
				]
			},
			{
				code: "hr",
				language: "croatian",
				sources: [
					{
						name: "Index.hr",
						url: "https://www.index.hr",
						path: "rss",
						endpoints: ["vijesti", "vijesti-hrvatska"],
						helpers: ["lordborne"]
					}
				]
			},
			{
				code: "onion",
				language: "english",
				sources: [
					{
						name: "Onion",
						url: "https://www.theonion.com",
						path: null,
						endpoints: ["rss"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "vz",
				language: "spanish",
				sources: [
					{
						name: "Voz de América",
						url: "https://www.voanoticias.com",
						path: "api",
						endpoints: ["zvirqoeojrqi"],
						helpers: []
					}
				]
			},
			{
				code: "vice",
				language: "english",
				sources: [
					{
						name: "Vice",
						url: "https://www.vice.com",
						path: "en_ca",
						endpoints: ["rss"],
						helpers: []
					}
				]
			},
			{
				code: "ch",
				language: "german",
				sources: [
					{
						name: "NZZ",
						url: "https://www.nzz.ch",
						path: null,
						endpoints: ["recent.rss", "international.rss", "schweiz.rss"],
						helpers: ["avulsed_"]
					}
				]
			},
			{
				code: "tr",
				language: "turkish",
				sources: [
					{
						name: "TRT Haber",
						url: "https://www.trthaber.com",
						path: null,
						endpoints: ["sondakika.rss"],
						helpers: ["caglapickaxe", "cgpx"]
					}
				]
			},
			{
				code: "hu",
				language: "hungarian",
				sources: [
					{
						name: "Origo",
						url: "https://www.origo.hu",
						path: "contentpartner/rss/itthon",
						endpoints: ["origo.xml"],
						helpers: ["noiredayz"]
					},
					{
						name: "Index.hu",
						url: "https://index.hu",
						path: "24ora",
						endpoints: ["rss"],
						helpers: ["noiredayz"]
					}
				]
			},
			{
				code: "nl",
				language: "dutch",
				sources: [
					{
						name: "NU",
						url: "https://nu.nl",
						path: "",
						endpoints: ["rss"],
						helpers: ["cbdg"]
					}
				]
			},
			{
				code: "hacker",
				language: "english",
				sources: [
					{
						name: "HackerNews",
						url: "https://hnrss.org",
						path: "",
						endpoints: ["frontpage"],
						helpers: []
					}
				]
			},
			{
				code: "lt",
				language: "lithuanian",
				sources: [
					{
						name: "15min",
						url: "https://15min.lt",
						path: "",
						endpoints: ["rss"],
						helpers: ["danolifer"]
					},
					{
						name: "Lrytas.lt",
						url: "https://lrytas.lt",
						path: "",
						endpoints: ["rss"],
						helpers: ["danolifer"]
					}
				]
			},
			{
				code: "at",
				language: "german",
				sources: [
					{
						name: "ORF.at",
						url: "https://rss.orf.at",
						path: "",
						endpoints: ["news.xml", "oesterreich.xml", "wien.xml"],
						helpers: ["kalifail_disbang"]
					}
				]
			},
			{
				code: "ua",
				language: "ukrainian",
				sources: [
					{
						name: "Radio Svoboda",
						url: "https://www.radiosvoboda.org",
						path: "api",
						endpoints: ["zrqiteuuir", "zjmkrey$ko"],
						helpers: ["boring_nick"]
					},
					{
						name: "Obozrevatel",
						url: "https://www.obozrevatel.com",
						path: "ukr",
						endpoints: ["rss.xml"],
						helpers: ["boring_nick"]
					},
					{
						name: "24TV",
						url: "https://24tv.ua",
						path: "rss",
						endpoints: ["all.xml"],
						helpers: ["boring_nick"]
					}
				]
			},
			{
				code: "cz",
				language: "czech",
				sources: [
					{
						name: "Aktualne.cz",
						url: "https://zpravy.aktualne.cz/",
						path: "rss",
						endpoints: ["domaci"],
						helpers: ["supinic"]
					},
					{
						name: "iRozhlas",
						url: "https://www.irozhlas.cz/",
						path: "rss/irozhlas/section",
						endpoints: ["zpravy-domov"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "se",
				language: "swedish",
				sources: [
					{
						name: "SVT",
						url: "https://www.svt.se/",
						path: "nyheter",
						endpoints: ["rss.xml"],
						helpers: []
					}
				]
			},
			{
				code: "de",
				language: "german",
				sources: [
					{
						name: "Tagesschau",
						url: "https://www.tagesschau.de",
						path: "xml",
						endpoints: ["rss2"],
						helpers: ["nerixyz"]
					},
					{
						name: "Tagesspiegel",
						url: "https://www.tagesspiegel.de/contentexport",
						path: "feed",
						endpoints: ["home"],
						helpers: ["de_munkey"]
					}
				]
			},
			{
				code: "be",
				language: "(multiple)",
				sources: [
					{
						name: "VRT",
						url: "https://www.vrt.be",
						path: "vrtnws",
						endpoints: ["de.rss.articles.xml", "fr.rss.articles.xml", "nl.rss.articles.xml"],
						helpers: ["supinic"]
					},
					{
						name: "La Libre",
						url: "https://www.lalibre.be/",
						path: "rss/section",
						endpoints: ["belgique.xml"],
						helpers: ["unitedfingers"]
					},
					{
						name: "Nieuwsblad",
						url: "https://www.nieuwsblad.be",
						path: "rss/section",
						endpoints: ["55178e67-15a8-4ddd-a3d8-bfe5708f8932"],
						helpers: ["unitedfingers"]
					}
				]
			},
			{
				code: "ro",
				language: "romanian",
				sources: [
					{
						name: "G4Media",
						url: "https://www.g4media.ro",
						path: null,
						endpoints: ["feed"],
						helpers: ["agenttud"]
					},
					{
						name: "HotNews",
						url: "https://www.hotnews.ro",
						path: null,
						endpoints: ["rss"],
						helpers: ["agenttud"]
					},
					{
						name: "Mediafax",
						url: "https://www.mediafax.ro/",
						path: null,
						endpoints: ["rss"],
						helpers: ["agenttud"]
					}
				]
			},
			{
				code: "ir",
				language: "iranian",
				sources: [
					{
						name: "رادیو فردا",
						url: "https://www.radiofarda.com",
						path: "api",
						endpoints: ["zpoqie-kqp"],
						helpers: ["somso2e"]
					},
					{
						name: "خبرگزاری مهر",
						url: "https://www.mehrnews.com/",
						path: null,
						endpoints: ["rss"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "fr",
				language: "french",
				sources: [
					{
						name: "Europe 1",
						url: "https://www.europe1.fr",
						path: null,
						endpoints: ["rss.xml", "rss/faits-divers.xml"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "sg",
				language: "english",
				sources: [
					{
						name: "CNA",
						url: "https://www.channelnewsasia.com",
						path: "api/v1",
						endpoints: ["rss-outbound-feed?_format=xml&category=10416"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "me",
				language: "montenegrin",
				sources: [
					{
						name: "RTCG",
						url: "https://www.rtcg.me",
						path: "vijesti",
						endpoints: ["rss.html", "drustvo/rss.html", "region/rss.html"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "pl",
				language: "polish",
				sources: [
					{
						name: "Polsat",
						url: "https://www.polsatnews.pl",
						path: "rss",
						endpoints: ["polska.xml"],
						helpers: ["n14pn", "supinic"]
					},
					{
						name: "TVN24",
						url: "https://tvn24.pl",
						path: null,
						endpoints: ["najnowsze.xml"],
						helpers: ["n14pn", "supinic"]
					}
				]
			},
			{
				code: "si",
				language: "slovenian",
				sources: [
					{
						name: "STA",
						url: "https://www.sta.si",
						path: null,
						endpoints: ["rss-1"],
						helpers: ["supinic"]
					},
					{
						name: "RTV SLO",
						url: "https://img.rtvslo.si",
						path: "feeds",
						endpoints: ["01.xml"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "no",
				language: "norwegian",
				sources: [
					{
						name: "NRK",
						url: "https://www.nrk.no",
						path: null,
						endpoints: ["norge/toppsaker.rss", "innlandet/siste.rss"],
						helpers: ["hotbear1110"]
					}
				]
			},
			{
				code: "el",
				language: "greek",
				sources: [
					{
						name: "Skai.gr",
						url: "https://feeds.feedburner.com",
						path: "skai",
						endpoints: ["PLwa"],
						helpers: []
					}
				]
			},
			{
				code: "sk",
				language: "slovak",
				sources: [
					{
						name: "TA3",
						url: "https://www.ta3.com",
						path: "rss",
						endpoints: ["5/novinky-z-domova"],
						helpers: ["supinic"]
					},
					{
						name: "Aktuality",
						url: "https://www.aktuality.sk",
						path: "rss",
						endpoints: ["domace", "krimi"],
						helpers: ["supinic"]
					},
					{
						name: "Teraz",
						url: "https://www.teraz.sk",
						path: "rss",
						endpoints: ["slovensko.rss"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "lv",
				language: "latvian",
				sources: [
					{
						name: "LSM",
						url: "https://www.lsm.lv",
						path: "rss",
						endpoints: ["?catid=20"],
						helpers: ["supinic"]
					},
					{
						name: "Delfi",
						url: "https://www.delfi.lv",
						path: "rss",
						endpoints: ["?channel=aculiecinieks"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "mk",
				language: "macedonian",
				sources: [
					{
						name: "Канал 5 ТВ",
						url: "https://kanal5.com.mk",
						path: null,
						endpoints: ["rss.aspx?id=2", "rss.aspx?id=7"],
						helpers: ["supinic"]
					},
					{
						name: "Time.mk",
						url: "https://time.mk",
						path: "rss",
						endpoints: ["makedonija", "skopje"],
						helpers: ["supinic"]
					},
					{
						name: "Макфакс",
						url: "https://makfax.com.mk",
						path: null,
						endpoints: ["makedonija/feed", "crna-hronika/feed"],
						helpers: ["supinic"]
					}
				]
			},
			{
				code: "al",
				language: "albanian",
				sources: [
					{
						name: "fax.al",
						url: "https://fax.al",
						path: "rss",
						endpoints: ["shqiperi", "kronika"],
						helpers: ["supinic"]
					}
				]
			}
		],

		extra: {
			exists: (code) => this.staticData.definitions.some(i => i.code === code.toLowerCase()),

			fetch: async (code, query) => {
				const news = this.staticData.definitions.find(i => i.code === code.toLowerCase());
				if (!news) {
					throw new sb.Error({ message: "Extra news code does not exist!" });
				}

				const source = sb.Utils.randArray(news.sources);
				const cacheKey = `${news.code}-${source.name}`;

				let cacheExists = true;
				let articles = await sb.Cache.getByPrefix(this.getCacheKey(), { keys: { cacheKey } });
				if (!articles) {
					cacheExists = false;

					const endpoint = sb.Utils.randArray(source.endpoints);
					const url = [source.url, source.path, endpoint].filter(Boolean).join("/");

					const xml = await sb.Got(url).text();
					const feed = await sb.Utils.parseRSS(xml);

					articles = feed.items.map(i => ({
						title: (i.title) ? i.title.trim() : null,
						content: (i.content) ? i.content.trim() : null,
						link: i.link || i.url,
						published: new sb.Date(i.pubDate).valueOf()
					}));
				}

				if (!cacheExists) {
					await sb.Cache.setByPrefix(this.getCacheKey(), articles, {
						keys: { cacheKey },
						expiry: 36e5
					});
				}

				if (query) {
					query = query.toLowerCase();

					const filteredArticles = articles.filter(i => (
						(i.title?.toLowerCase().includes(query))
						|| (i.content?.toLowerCase().includes(query))
					));

					return sb.Utils.randArray(filteredArticles);
				}
				else {
					return sb.Utils.randArray(articles);
				}
			}
		}
	})),
	Code: (async function news (context, ...rest) {
		const { codeRegex, extra } = this.staticData;
		if (rest[0] && extra.exists(rest[0])) {
			const code = rest.shift();

			let article;
			try {
				article = await extra.fetch(code, rest.join(" ") || null);
			}
			catch (e) {
				console.warn(e);
				return {
					success: false,
					reply: `Could not fetch any articles due to website error!`
				};
			}

			if (!article) {
				return {
					reply: "No relevant articles found!"
				};
			}

			const { content, title, published } = article;
			const separator = (title && content) ? " - " : "";
			const delta = (published)
				? `(published ${sb.Utils.timeDelta(new sb.Date(published))})`
				: "";

			return {
				reply: sb.Utils.fixHTML(sb.Utils.removeHTML(`${title ?? ""}${separator}${content ?? ""} ${delta}`))
			};
		}

		let availableLanguages = await sb.Cache.getByPrefix(this);
		if (!availableLanguages) {
			const { languages } = await sb.Got("GenericAPI", {
				url: "https://api.currentsapi.services/v1/available/languages",
				headers: {
					Authorization: sb.Config.get("API_CURRENTSAPI_TOKEN")
				},
				responseType: "json"
			}).json();

			availableLanguages = Object.keys(languages).map(i => i.toLowerCase());
			await sb.Cache.setByPrefix(this, availableLanguages, {
				expiry: 7 * 864e5
			});
		}

		const params = new sb.URLParams();
		if (rest[0] && codeRegex.test(rest[0])) {
			const languageDescriptor = sb.Utils.modules.languageISO.get(rest[0]);
			if (!languageDescriptor) {
				return {
					success: false,
					reply: "Provided language does not exist!"
				};
			}

			const languageName = languageDescriptor.names[0];
			if (!availableLanguages.includes(languageName)) {
				return {
					success: false,
					reply: "Provided language is not supported!"
				};
			}

			rest.splice(0, 1);
			params.set("language", languageDescriptor.iso6391);
		}
		else {
			params.set("language", "en");
		}

		if (rest.length > 0) {
			params.set("keywords", rest.join(" "));
		}

		let response;
		try {
			response = await sb.Got("GenericAPI", {
				url: "https://api.currentsapi.services/v1/search",
				searchParams: params.toString(),
				headers: {
					Authorization: sb.Config.get("API_CURRENTSAPI_TOKEN")
				},
				throwHttpErros: false,
				responseType: "json",
				retry: 0,
				timeout: 2500
			});
		}
		catch (e) {
			if (e instanceof sb.Got.TimeoutError || e instanceof sb.errors.GenericRequestError) {
				return {
					success: false,
					reply: "No relevant news articles found!"
				};
			}
			else {
				throw e;
			}
		}

		const { news } = response.body;
		if (!news) {
			return {
				success: false,
				reply: "No news data returned!"
			};
		}
		else if (news.length === 0) {
			return {
				success: false,
				reply: "No relevant articles found!"
			};
		}

		const { description = "", published, title } = sb.Utils.randArray(news);
		const separator = (title && description) ? " - " : "";
		const delta = (published)
			? `(published ${sb.Utils.timeDelta(new sb.Date(published))})`
			: "";

		return {
			reply: sb.Utils.removeHTML(`${title}${separator}${description} ${delta}`)
		};
	}),
	Dynamic_Description: (async (prefix, values) => {
		const { definitions } = values.getStaticData();
		const extraNews = definitions.sort((a, b) => a.code.localeCompare(b.code)).map(def => {
			const { code, language, sources } = def;

			const links = [];
			const helpers = [];
			for (const source of sources) {
				links.push(`<a href="${source.url}">${source.name}</a>`);
				helpers.push(...source.helpers);
			}

			const uniqueHelpers = (helpers.length > 0)
				? [...new Set(helpers)].join(", ")
				: "N/A";

			return sb.Utils.tag.trim `
				<tr>
					<td>${code.toUpperCase()}</td>
					<td>${sb.Utils.capitalize(language)}</td>
					<td>${links.join("<br>")}
					<td>${uniqueHelpers}</td>
				</tr>
			`;
		}).join("");

		return [
			`Fetches short news articles. Powered by <a href="https://currentsapi.services/en">CurrentsAPI</a>`,
			"",

			`<code>${prefix}news</code>`,
			"(worldwide news in english)",
			"",

			`<code>${prefix}news (text to search)</code>`,
			"(worldwide news in english, that contain the text you searched for",
			"",

			`<code>${prefix}news (two-letter country code)</code>`,
			"(country-specific news)",
			"",

			`<code>${prefix}news (two-letter country code) (text to search for)</code>`,
			"(country-specific news that contain the text you searched for)",
			"",

			`<code>${prefix}news (special combination)</code>`,
			"(special news, usually country-specific. consult table below)",
			"",

			"The following are special codes. Those were often 'helped' by people.",
			`<table><thead><th>Code</th><th>Language</th><th>Sources</th><th>Helpers</th></thead>${extraNews}</table>`,
			""
		];
	})
};
