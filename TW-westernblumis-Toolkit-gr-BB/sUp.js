scriptUp = {
	// CT:'0.3.0.5',
	// CTn:'Bugfix',
	// QIS:'1.6.6',
	// QISn:'New items and sets added',
	// LT:'1.45.5',
	// LTn:'-BonusSearch: Buffs added<br>-Spanish corrected (thx to pepe100)',
	// Tweaker:'0.1.20',
	// Tweakern:'',
	// GJ:'1.15',
	// GJn:'Bugfix',
	// NPC:'1.1.8',
	// NPCn:'-Italian added (thx to Billy-AR)<br>-Change language in scripts window',
	// TWS:'1.3.3',
	// TWSn:'Bugfix for extended inventory',
	// TWSu:'Sweets',
	// TWM:'4.170',
	// TWMn:'<a href="javascript:TWM.settings.open();TWM.settings.openChangeLog()">Changelog</a>',
	// TWN:'1.022',
	// TWNn:'-Nick in chat: set own nicknames<br>-3 new sounds<br>-Bugfixes',
	// TWX:'1.49.8',
	// TWXn:'-TraderSell: mark named and set items as non sellable<br>-QuestWiki: show new questlines on KB',
	// TWXu:'Essentials',
	// MBB:'0.4.8',
	// MBBn:'',
	// KoM:'1.75',
	// KoMn:'-Greek added (thx to Timemod Herkumo)<br>-Bugfixes',
	// BS:'1.0.14',
	// BSn:'Greek added (thx to Timemod Herkumo)',
	// DJ:'2.3.9',
	// DJn:'Bugfixes',
	// TWT:'1.4.7',
	// TWTn:'Bugfix',
	// TWTu:'Collections',
	// FBT:'1.21',
	// FBTn:'Litte fix in the fort battle formula',
	WTK: "1.15",
	WTKn: "Testing Update Notification",
	// TWIR:'2.204.9',
	// TWIRn:'Buff categorization fixed, MassOpener removed',
	cs: ["Aktualizovat", "NovÃ¡ verze scriptu je dostupnÃ¡"],
	de: ["Update", "FÃ¼r das Script ist eine neue Version erhÃ¤ltlich"],
	el: ["ΟΚ", "Μια νέα έκδοση είναι διαθέσιμη για το UserScript, παρακαλώ κάντε κλικ στο OK για να το ανανεώσετε.",],
	en: ["Update", "A new version of the script is available"],
	es: ["ActualizaciÃ³n", "Una nueva versiÃ³n del script estÃ¡ disponible"],
	fr: ["Mise Ã  jour", "Une nouvelle version du script est disponible"],
	it: ["Atualizar", "Script aggiornamento disponibile"],
	hu: ["FrissÃ­tÃ©s", "Egy Ãºj vÃ¡ltozata a script elÃ©rhetÅ‘"],
	nl: ["Update", "Er is een nieuwe versie van dit script beschikbaar"],
	pl: ["Aktualizacja", "Nowa wersja skryptu jest dostÄ™pna"],
	pt: ["AtualizaÃ§Ã£o", "Uma nova versÃ£o do script estÃ¡ disponÃ­vel"],
	ro: ["Actualizare", "O nouÄƒ versiune este disponibilÄƒ"],
	ru: [
		"ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ",
		"Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐºÑ€Ð¸Ð¿Ñ‚Ð°",
	],
	sk: ["AktualizovaÅ¥", "NovÃ¡ verzia scriptu je dostupnÃ¡"],
	tr: ["GÃ¼ncelleÅŸtir", "Scriptin yeni bir sÃ¼rÃ¼mÃ¼"],
	cD: 0,
	// c: function (s, v, n, a, w, l) {
	// 	if (this[s] != v) {
	// 		l = l || a;
	// 		l = this[l] || this.en;
	// 		var u = this[s + "u"],
	// 			t = u
	// 				? "//the-west-scripts.github.io/The-West-" + u + "/script.user.js"
	// 				: w + "/code.user.js",
	// 			m = new west.gui.Dialog(
	// 				l[0] + ": " + n,
	// 				"<span>" +
	// 					l[1] +
	// 					"<br><br><b>v" +
	// 					this[s] +
	// 					":</b><br>" +
	// 					this[s + "n"] +
	// 					"</span>",
	// 				"warning"
	// 			)
	// 				.setDraggable(1)
	// 				.addButton(l[0], function () {
	// 					m.hide();
	// 					location.href = t;
	// 				})
	// 				.addButton("cancel")
	// 				.show();
	// 	}
	// 	this.cD = 1;
	// },
};
var sI = setInterval(function () {
	if (scriptUp.cD) {
		clearInterval(sI);
		// var x = ["LT", "CT", "QIS", "NPC", "MBB", "BS", "KoM"],
			// z = "";
		// for (var y of x) if (window[y]) z += "- " + window[y].name + "<br>";
		// if (z && !localStorage.getItem("TWXnoRemind"))
			// new west.gui.Dialog(
			// 	"Scripts renamed",
			// 	"<span>These Scripts were merged into the new <b>TW Essentials</b>.<br><br>" +
			// 		z +
			// 		"<br>Please " +
			// 		(window.TWX
			// 			? ""
			// 			: 'install <a href="//the-west-scripts.github.io/The-West-Essentials/script.user.js">TW Essentials</a><br>and ') +
			// 		'remove the listed scripts from Grease-/Tampermonkey:<br><img src="//imgur.com/tGIkeM7.png"><br><br><img src="//imgur.com/so3OyYC.png"></span>',
			// 	"warning"
			// )
			// 	.setDraggable(1)
			// 	.addButton("Stop reminding me", localStorage.setItem("TWXnoRemind", 1))
			// 	.addButton("ok")
			// 	.show();
		// var trl = "https://tomrobert.github.io/TWIR/";
		// if (window.TWIR && TWIR.base_url != trl)
		// 	scriptUp.c("TWIR", TWIR.version, TWIR.script_name, "", trl, TWIR.lang);
		// FortBattleWindow.savePosition_twx =
		// 	FortBattleWindow.savePosition_twx || FortBattleWindow.savePosition;
		// FortBattleWindow.savePosition = function () {
		// 	if (!$(".fortbattle-" + this.fortId + " .fort_battle_timer").length)
		// 		return;
		// 	FortBattleWindow.savePosition_twx.apply(this, arguments);
		// };
		// var style = document.createElement("style");
		// style.type = "text/css";
		// style.innerHTML =
		// 	"div#CC_pin_items{left:24px}\n .inventory .open_search {left:-9px}\n .inventory .actions .upgrade_items {margin-left:32px}\n .inventory .bag_resize {right:-9px}\n .TWX_sellable_button {left:23px!important}";
		// document.head.appendChild(style);
	}
}, 5000);
