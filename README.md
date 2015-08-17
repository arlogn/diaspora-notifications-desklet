# diaspora* notifications desklet
Cinnamon desklet to display a counter of unread diaspora* notifications.

Install:
- copy <code>notifications@diaspora</code> folder to <code>~/.local/share/cinnamon/desklets/</code>
- edit <code>settings.py</code> and enter your pod url/credentials
- add to desktop via System-Settings/Desklet
- configure font-size and checking-timeout by right clicking on it

The desklet uses some of [Diaspy](https://github.com/marekjm/diaspy) modules to connect to diaspora* and retrieve the unread notifications.  
Diaspy requires <code>Requests</code> HTTP library.
