#! /usr/bin/env python

import os
import settings

DESKLET_DIR = os.path.dirname(__file__)

db = DESKLET_DIR + "/notifications.db"
log = DESKLET_DIR + "/log.txt"
count = 0;

import logging
logging.basicConfig(filename=log, level=logging.getLevelName(settings.level), format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger(__name__)

try:
    import diaspy
    c = diaspy.connection.Connection(pod=settings.pod, username=settings.username, password=settings.password)
    c.login()
    last = diaspy.notifications.Notifications(c).last()
    for n in last:
        if n.unread:
            count += 1
except Exception as e:
    logger.error(e)

f = open(db, 'w')
f.write(str(count))
f.close
