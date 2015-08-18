const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;
const St = imports.gi.St;
const Util = imports.misc.util;
const Desklet = imports.ui.desklet;
const Settings = imports.ui.settings;
const deskletDir = imports.ui.deskletManager.deskletMeta["notifications@diaspora"].path;
const db = deskletDir + "/notifications.db";

function MyDesklet(metadata, desklet_id){
    this._init(metadata, desklet_id);
}

MyDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id){
        Desklet.Desklet.prototype._init.call(this, metadata);
        this._notifications = new St.Label({style_class: "notifications-label"});
        this.setContent(this._notifications);

        this._showNotifications();

        try {
            let gfile = Gio.file_new_for_path(db);
            this.monitor = gfile.monitor_file(Gio.FileMonitorFlags.NONE, null);
            this.monitor.connect("changed", Lang.bind(this, this._showNotifications));
        }
        catch (e) {
            global.logError(e);
        }

        this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);

        this.settings.bindProperty(Settings.BindingDirection.IN,
                                "time-out",
                                "minutes",
                                function() {},
                                null);

        this.settings.bindProperty(Settings.BindingDirection.IN,
                                "font-size",
                                "size",
                                this._onSettingsChanged,
                                null);

        this._onSettingsChanged();
        this._updateLoop();
    },

    _onSettingsChanged: function() {
        this._notifications.style="font-size: " + this.size + "px";
    },

    _showNotifications: function() {
        let count = "-";

        if (GLib.file_test(db, GLib.FileTest.EXISTS)) {
            let content = GLib.file_get_contents(db);
            if (content)
                count = content.toString().replace("true,", "");
        } else {
            GLib.file_set_contents(db, count);
        }

        this._notifications.set_text(count);
    },

    _updateNotifications: function() {
        try {
            Util.spawnCommandLine(deskletDir + "/get_notifications.py");
        }
        catch (e) {
            global.logError(e);
        }
	},

    _updateLoop: function() {
        this._updateNotifications();
        this.timeout = Mainloop.timeout_add_seconds(this.minutes*60, Lang.bind(this, this._updateLoop));
    },

    on_desklet_removed: function() {
        if (this.monitor) this.monitor.cancel();
        Mainloop.source_remove(this.timeout);
    }
}

function main(metadata, desklet_id) {
    let desklet = new MyDesklet(metadata, desklet_id);
    return desklet;
}
