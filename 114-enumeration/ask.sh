# Logs in to each address with a wrong password: what does the log-in say?
for name in ada bob sam joe kim zoe; do
  echo "$name: $(curl -s "localhost:$1/login" -d "email=$name@example.com&password=guess")"
done
