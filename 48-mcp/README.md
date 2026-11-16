# Tools for AI Clients: a Recipe Box Your AI Can Use (fn mcp in Quillo)

The recipe box: a page for people, and two tools for an AI client (fn mcp find_recipes and add_recipe). quillo mcp main.qwe serves the tools on stdio; examples/calls.jsonl holds an AI client's messages, and examples/client.json the lines that tell a client to start it.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
