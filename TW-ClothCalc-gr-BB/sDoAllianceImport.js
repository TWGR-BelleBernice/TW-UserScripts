try {
	TWDB = window.TWDB || {}
	TWDB.AllianceImport = {
		importURL: "//tw-db.info/alliance_map_import.php",
		alliances: {},
		data: {},

		allianceCount: 0,
		receivedAlliances: 0,
		fortCount: 0,
		receivedForts: 0,
		mapFortToAlliance: {},

		start: function () {
			this.gui.parent = this
			this.gui.init()
			this.gui.$("list").setMaxValue(1)
			$.post(
				"game.php?window=map&ajax=get_minimap",
				{},
				resp => {
					this.processMap(resp)
				},
				"json"
			)
		},
		processMap: function (data) {
			this.gui.$("list").increase()

			/* construct list of alliances & add towns */
			$.each(data.towns, (_i, town) => {
				if (!town.npctown && town.alliance_id != null && town.member_count > 0) {
					var a = this.alliances[town.alliance_id]
					if (!a) {
						a = this.alliances[town.alliance_id] = {
							id: town.alliance_id,
							name: null,
							members: 0,
							points: null,
							towns: {},
							forts: {},
							avg_level: null,
							fbcnt: null,
						}
						this.allianceCount++
					}
					a.members += town.member_count * 1
					a.towns[town.town_id] = {
						id: town.town_id,
						name: town.name,
						members: town.member_count,
						points: town.town_points,
						x: town.x,
						y: town.y,
					}
				}
			})

			/* add forts */
			$.each(data.forts, (_i, x) => {
				$.each(x, (_i, y) => {
					if (typeof y === "object" && y.fort.alliance_id != null) {
						var a = this.alliances[y.fort.alliance_id]
						if (!a) return
						this.fortCount++
						a.forts[y.fort.fort_id] = {
							id: y.fort.fort_id,
							name: y.fort.name,
							type: y.fort.type,
							points: null,
							x: y.fort.x,
							y: y.fort.y,
							leading: y.fort.town_id,
						}
						this.mapFortToAlliance[y.fort.fort_id] = a
					}
				})
			})

			this.requestAlliances()
			this.requestForts()
		},
		requestAlliances: function () {
			this.gui.$("alliances").setMaxValue(this.allianceCount)

			$.each(this.alliances, id => {
				$.post(
					"game.php?window=alliance&mode=get_data",
					{ alliance_id: id },
					resp => {
						if (resp.error) this.error(`Failed to get alliance id ${id}:${resp.error}`)
						else this.addAlliance(resp.data)
					},
					"json"
				)
			})
		},
		addAlliance: function (a) {
			this.gui.$("alliances").increase()
			this.receivedAlliances++
			var o = this.alliances[a.allianceId]
			o.name = a.allianceName

			var count = 0,
				lvl_sum = 0,
				fbcnt = 0
			if (typeof a.chars.length === "undefined")
				for (var key in a.chars) {
					count += a.chars[key].cnt * 1
					lvl_sum += a.chars[key].avg_level * a.chars[key].cnt
					fbcnt += a.chars[key].fbcnt * 1
				}
			if (count !== o.members || count === 0)
				if (Math.abs(count - o.members) > 1)
					this.error(
						"Town member and total member values don't match! (" +
							o.members +
							" vs " +
							count +
							", alliance: " +
							a.allianceId +
							")"
					)
				/* IGNORE */ else;

			o.avg_level = lvl_sum / count
			o.fbcnt = fbcnt

			$.each(a.towns, (_i, t) => {
				if (o.towns[t.town_id]) o.towns[t.town_id].rights = t.member_right
			})

			if (this.receivedAlliances === this.allianceCount && this.receivedForts === this.fortCount)
				this.process()
		},
		requestForts: function () {
			this.gui.$("forts").setMaxValue(this.fortCount)

			$.each(this.alliances, (_id_a, alliance) => {
				$.each(alliance.forts, (id_f, fort) => {
					$.post(
						"game.php?window=fort&mode=display",
						{ x: fort.x, y: fort.y },
						resp => {
							if (!resp.data) {
								console.log(
									"Failed to get fort id " +
										id_f +
										" ([" +
										fort.x +
										"," +
										fort.y +
										"]):" +
										resp.message
								)
								delete alliance.forts[id_f]
								this.addFort(false)
							} else this.addFort(resp.data)
						},
						"json"
					)
				})
			})
		},
		addFort: function (f) {
			this.gui.$("forts").increase()
			this.receivedForts++
			if (f) {
				var a = this.mapFortToAlliance[f.fortid],
					o = a.forts[f.fortid]

				o.points = f.points - a.towns[o.leading].points
				if (!o.points || o.points <= 0)
					this.error(
						"Fort points yield an invalid value! (" +
							f.points +
							" vs " +
							a.towns[o.leading].points +
							")"
					)
			}

			if (this.receivedAlliances === this.allianceCount && this.receivedForts === this.fortCount)
				this.process()
		},

		process: function () {
			this.gui.$("process").setMaxValue(2)

			$.each(this.alliances, (_id, a) => {
				a.memberPoints = a.members ** (1 / 2) * a.avg_level ** (3 / 2) * 5
				a.townPoints = 0
				a.fortPoints = 0
				$.each(a.towns, (_id_t, t) => {
					a.townPoints += ((Math.min(1e5, t.points) * t.members) / 50) * 0.05
				})
				$.each(a.forts, (_id_f, f) => {
					a.fortPoints += { 0: 7500, 1: 12500, 2: 20000 }[f.type] + f.points
				})
				a.points = a.memberPoints + a.townPoints + a.fortPoints
			})
			var topX = $.each(
				$.map(
					$.map(this.alliances, (e, _i) => {
						e.modPoints = e.points
						return e
					}).sort((a, b) => (a.points < b.points ? 1 : -1)),
					(e, i) => (i < 8 ? e : undefined)
				).sort((a, b) => (a.fbcnt / a.members < b.fbcnt / b.members ? 1 : -1)),
				(i, e) => {
					e.modPoints = e.points * ({ 0: 1.2, 1: 1.1, 2: 1.05 }[i] || 1)
				}
			).sort((a, b) => (a.modPoints < b.modPoints ? 1 : -1))
			setTimeout(() => {
				this.prepare(topX)
			}, 50)
		},

		prepare: function (topX) {
			if (!topX) return this.process()
			this.gui.$("process").increase()
			function enc(str) {
				return `${str}`.replace(",", "&#44;")
			}
			function gpc(o) {
				var c = 0
				for (var _i in o) c++
				return c
			}

			this.data.world = window.location.host
			this.data.version = TheWestApi.version * 1
			this.data.towns = $.map(topX, a =>
				$.map(a.towns, t =>
					[a.id, enc(t.name), t.id, t.members + t.rights * 100 - 100, t.x, t.y].join(",")
				).join(",,,")
			).join(",,,")
			this.data.forts = $.map(topX, a =>
				$.map(a.forts, f => [a.id, enc(f.name), f.id, f.type + 1, f.x, f.y].join(",")).join(",,,")
			).join(",,,")
			this.data.alliances = $.map(this.alliances, a =>
				[a.id, enc(a.name), gpc(a.towns), gpc(a.forts), a.members, Math.floor(a.modPoints)].join(
					","
				)
			).join(",,,")

			setTimeout(() => {
				this.send()
			}, 50)
		},

		send: function () {
			this.gui.$("process").increase()
			var id = "TWDBA_Import"
			var ifr = $(
				'<iframe id="' +
					id +
					'_frame" style="vertical-align: middle;width:330px;height:19px;" marginwidth="0" marginheight="0" ' +
					'hspace="0" vspace="0" frameborder="0" scrolling="no" allowtransparency="true"></iframe>'
			)
				.appendTo(this.gui.send.html("").show())
				.get(0)
			var ifrd = ifr.contentWindow || ifr.contentDocument
			if (ifrd.document) ifrd = ifrd.document
			ifrd.write(
				'<form name="' +
					id +
					'_form" style="display:none" action="' +
					this.importURL +
					'" method="post">' +
					$.map(
						this.data,
						(_data, key) => `<input type="hidden" id="${id}_${key}" name="${key}" />`
					).join("") +
					'</form><script type="text/javascript">' +
					$.map(
						this.data,
						(data, key) =>
							'document.getElementById("' +
							id +
							"_" +
							key +
							'").value=' +
							JSON.stringify(data) +
							";"
					).join("") +
					"document.forms." +
					id +
					"_form.submit();" +
					'setInterval(function(){ var x=document.getElementById("' +
					id +
					'_anim");if(x)x.innerHTML = "|"+x.innerHTML+"|"; },100);' +
					'</script><div id="' +
					id +
					'_anim" style="text-align:center;">[Uploading]</div>'
			)
			setTimeout(() => {
				var link = `http://tw-db.info/?strana=politic_map&world=${location.hostname.split(".")[0]}`
				this.gui.table
					.appendToCell("foot", "twdb_stage", "Link:")
					.appendToCell("foot", "twdb_progress", `<a href="${link}" target="_blank">${link}</a>`)
			}, 1000)
		},

		gui: {
			window: null,
			table: null,
			send: $("<div>"),
			stages: {
				list: { name: "Retrieve alliance list" },
				alliances: { name: "Retrieve alliance data" },
				forts: { name: "Retrieve fort data" },
				process: { name: "Process and prepare" },
				send: { name: "Send to TW-DB.info" },
			},
			css:
				".twdb_alliance .twdb_innerwnd { width:540px; position:absolute; left:5px; top:2px; }" +
				".twdb_alliance .twdb_stage { width:170px; } " +
				".twdb_alliance .tbody .twdb_stage { padding-left:6px; } .twdb_alliance .tbody .row { left:0px; }" +
				".twdb_alliance .twdb_progress { text-align:center; width:330px; } ",
			init: function () {
				$("#TWDBA_Import_css").remove()
				$(`<style type="text/css" id="TWDBA_Import_css">${this.css}</style>`).appendTo($("head"))
				this.window = wman
					.open("twdb_alliance", "TW-DB Alliance Import")
					.setMiniTitle("TW-DB Alliance Import")
					.setTitle("TW-DB Alliance Import")
					.setSize(604, 315);
				this.table = new west.gui.Table(true);
				this.table
					.appendTo($('<div class="twdb_innerwnd"></div>').appendTo(this.window.getContentPane()))
					.addColumns(["twdb_stage", "twdb_progress"])
					.appendToCell("head", "twdb_stage", "Task")
					.appendToCell("head", "twdb_progress", "Progress")
				for (var stage in this.stages)
					this.table
						.appendRow()
						.appendToCell(-1, "twdb_stage", this.stages[stage].name)
						.appendToCell(
							-1,
							"twdb_progress",
							(stage !== "send"
								// biome-ignore lint/suspicious/noAssignInExpressions: testing
								? (this.stages[stage].progress = new west.gui.Progressbar(0, 0)).getMainDiv()
								: this.send
							)
							.hide()
						)
			},
			$: function (stage) {
				this.stages[stage].progress.getMainDiv().show()
				return this.stages[stage].progress
			},
		},
		error: msg => {
			try {
				throw new Error(msg)
			} catch (e) {
				TWDB.LastError = e
				$(TWDB.AllianceImport.gui.window.getContentPane()).html(
					`TWDB Alliance Import encountered an error: <br /><br />${e.message}<br />${e.stack}`
				)
			}
		},
	}

	TWDB.AllianceImport.start()
} catch (e) {
	TWDB.LastError = e
	$(TWDB.AllianceImport.gui.window.getContentPane()).html(
		`TWDB Alliance Import encountered an error: <br /><br />${e.message}<br />${e.stack}`
	)
}
void 0
