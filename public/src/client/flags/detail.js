'use strict';

/* globals define */

define('forum/flags/detail', ['components', 'translator'], function (components, translator) {
	var Flags = {};

	Flags.init = function () {
		// Update attributes
		$('#state').val(ajaxify.data.state).removeAttr('disabled');
		$('#assignee').val(ajaxify.data.assignee).removeAttr('disabled');

		$('[data-action]').on('click', function () {
			var action = this.getAttribute('data-action');

			switch (action) {
				case 'update':
					socket.emit('flags.update', {
						flagId: ajaxify.data.flagId,
						data: $('#attributes').serializeArray()
					}, function (err, history) {
						if (err) {
							return app.alertError(err.message);
						} else {
							app.alertSuccess('[[flags:updated]]');
							Flags.reloadHistory(history);
						}
					});
					break;
				
				case 'appendNote':
					socket.emit('flags.appendNote', {
						flagId: ajaxify.data.flagId,
						note: document.getElementById('note').value
					}, function (err, payload) {
						if (err) {
							return app.alertError(err.message);
						} else {
							app.alertSuccess('[[flags:note-added]]');
							Flags.reloadNotes(payload.notes);
							Flags.reloadHistory(payload.history);
						}
					});
					break;
			}
		});
	};

	Flags.reloadNotes = function (notes) {
		templates.parse('flags/detail', 'notes', {
			notes: notes
		}, function (html) {
			var wrapperEl = components.get('flag/notes');
			wrapperEl.empty();
			wrapperEl.html(html);
			wrapperEl.find('span.timeago').timeago();
			document.getElementById('note').value = '';
		});
	};

	Flags.reloadHistory = function (history) {
		templates.parse('flags/detail', 'history', {
			history: history
		}, function (html) {
			translator.translate(html, function (translated) {
				var wrapperEl = components.get('flag/history');
				wrapperEl.empty();
				wrapperEl.html(translated);
				wrapperEl.find('span.timeago').timeago();
			});
		});
	};

	return Flags;
});