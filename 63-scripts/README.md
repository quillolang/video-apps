# Two Command-Line Tools, Against the Clock: Scripts in Quillo (args, stdin, files)

Two command-line tools, each a Quillo script with no routes: words.qwe prints the words used most in a text piped in (stdin, args), and habits.qwe is a habit tracker kept in a JSON file (args, env and .env, read_file, write_file, exit). fable.txt is a short fable to count.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
cat fable.txt | quillo run words.qwe -- 5
quillo run habits.qwe -- did stretch
quillo run habits.qwe -- show
```
