"""
ASGI config for mysite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
#
# application = get_asgi_application()

import os
import django
# from channels.routing import get_default_application
from channels.routing import get_default_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
django.setup()
application = get_default_application()