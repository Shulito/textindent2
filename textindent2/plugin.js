CKEDITOR.plugins.add("textindent2", {
	icons: "indent_increase,indent_decrease",
    availableLangs: {"en":1, "es":1},
    lang: "es, en",
	init: function(editor) {
		var isNotDefined = function(value) {
			return value === undefined || value == null || value == "";
		}

		var isNumber = function(c) {
			return "0123456789".indexOf(c) !== -1;
		}

		var extractIndentationFromString = function(str) {
			var numbers = "";

			for (var i = 0; i < str.length; i++) {
				var c = str.charAt(i);

				if (isNumber(c)) {
					numbers += c;
				} else {
					break;
				}
			}

			return parseInt(numbers);
		}

		var indentation = editor.config.indentation;
		if (indentation === undefined) {
			indentation = 50;
		}

		if (editor.ui.addButton) {
			editor.ui.addButton("indent_increase", {
				label: editor.lang.textindent2.increaseLabelName,
				command: "increaseIndentationLevel",
				toolbar: "insert",
			});

			editor.ui.addButton("indent_decrease", {
				label: editor.lang.textindent2.decreaseLabelName,
				command: "decreaseIndentationLevel",
				toolbar: "insert",
			});
		}

		editor.addCommand("increaseIndentationLevel", {
			allowedContent: "p",
			requiredContent: "p",
			exec: function() {
				var element = editor.elementPath().block;
				var indent = element.getStyle("text-indent");

				editor.fire("saveSnapshot");

				if (isNotDefined(indent)) {
					element.setStyle("text-indent", indentation + "px");
				} else {
					element.setStyle("text-indent", (extractIndentationFromString(indent) + indentation) + "px");
				}
			}
		});

		editor.addCommand("decreaseIndentationLevel", {
			allowedContent: "p",
			requiredContent: "p",
			exec: function() {
				var element = editor.elementPath().block;
				var indent = element.getStyle("text-indent");

				if (!isNotDefined(indent)) {
					editor.fire("saveSnapshot");

					var currentIndentation = extractIndentationFromString(indent);
					if (currentIndentation - indentation > 0) {
						element.setStyle("text-indent", (currentIndentation - indentation) + "px");
					} else {
						element.removeStyle("text-indent");
					}
				}
			}
		});
	}
});
