# Usage
All commands below can be run with or without parameters.
If a command is run without a param and param is required, an interactive prompt will be shown to the user.

## Show
Show manual pages.
When a name param is missing, then all possible manuals are shown.

**Parameters**:
- **name** - name of manual
```sh
mdman <MANUAL_NAME>
```

## Add
Install/add manual into madman.

**Parameters**:
- **name** - name of manual
- **remote** - if it is a remote manual or not (omit, when manual `*.md` files will be handled locally)
- **repo** - if `--remote` param existing, then git repo url is needed
- **folder** - folder, where `*.md` files are located (in case of remote manual, then folder is relative to repository folder)
```sh
madman add --name <MANUAL_NAME> [--remote <true/false>] [--repo <GIT_REPOSITORY_URL>] [--folder <DOCUMENTATION_FOLDER>]
```
Example of adding remote documentation from https://github.com/Raiper34/madman docs folder:
```sh
madman add --name madman-doc --remote true --repo git@github.com:Raiper34/madman.git --folder docs
```
Example of adding local documentation (folder with `*.md` files):
```sh
madman add --name my-doc --remote false --folder ~home/documentation
```

## List
Show the list of installed manuals that are ready to use.
```sh
madman list
```

## Remove
Remove installed manual.

**Parameters**:
- **name** - name of manual
```sh
madman remove --name <MANUAL_NAME_TO_REMOVE>
```

## Update
Update the installed manual (currently only name is updatable).

**Parameters**:
- **name** - name of manual to update name
- **newName** - new name of manual
```sh
madman update --name <MANUAL_NAME_TO_UPDATE> --newName -- <NEW_MANUAL_NAME>
```

## Fetch
Fetch update of remote manual. Update a local manual version with changes from remote repo.

**Parameters**:
- **name** - name of manual to fetch
```sh
madman fetch --name <MANUAL_NAME_TO_FETCH>
```