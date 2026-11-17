# One Extra JSON Field Made Me an Admin (Mass Assignment and Prototype Pollution)

Pip's Club: sign up, save your settings, and an admin page, written twice. In plain Node (node/server.mjs) a sign-up is Object.assign of the JSON body, so a role sent along becomes the member's role; and a deep merge of settings follows a __proto__ key into Object.prototype, so every object, even a missing user, has role 'admin'. In Quillo, the video's first version (steps/v1) takes the body as a User record that declares a role, so a role sent along still counts; but __proto__ is only a key there. The app takes a SignUp record with just a name, and gives the role itself.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -s --json '{"name": "Eve", "role": "admin"}' localhost:8080/signup
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the body taken as a User, whose record has a role: a role sent along is kept
- this folder: a SignUp record with only a name; the role given by the server
