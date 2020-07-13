#/var/www/html/vev/bin/gunicorn --workers 3 --bind unix:/var/www/html/mysite.sock mysite.asgi:application
cd /var/www/html/
kill -9 $(lsof -t -i:8000)
source vev/bin/activate
daphne -p 8000 -b 0.0.0.0 mysite.asgi:application