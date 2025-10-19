# Getting started
Installation is performed using `npm`.

## Installation
Install **madman** tool
```
npm install madman --global
```

## Add
To add the first documentation, run `madman add` command like  
```
madman add --name example --remote true --repo git@github.com:Raiper34/madman.git --folder docs
``` 
Then command creates example documentation from `docs` folder of `git@github.com:Raiper34/madman.git` repository.

## Show
To show documentation, run `madman <DOC_NAME>` command
```
madman example
```
now it is possible to navigate in documentation using `arrow` keys and show a specific page using the `enter` key.