# 1337 enhancer

A zero dependency chrome extension which enhances the over all user experience in 1337x sites.

## Features
1. Allows sorting the table based on Seeds, Leech, Size and uploader.
2. Allows batch copying magnet links.
3. Adds a new column to the table with the magnet link to the torrent.
4. Adds the screenshot from the torrent description to a popup on hovering.
5. Customizable options. For example, disable hover popups or specifying the width of the popup.
6. Many more... 

## Building locally
- Clone or download the repo `git clone https://github.com/rishav394/1337-enhancer.git` 
- Install all dev-dependencies `npm i`
- `npm run dev`

## Currently supported sites
- [x] 1337.root.yt
- [x] 1337x.to
- [x] 1337x.st
- [x] x1337x.ws
- [x] x1337x.eu
- [x] x1337x.se
- [x] 1337x.is
- [x] 1337x.gd

## Current plans
- [ ] Convert manifest to version 3
- [ ] Make pug file generic that auto makes rows and values according to option types
- [ ] Implement React based popup

## Contribution

I don't spend a lot of time developing this extension and made it specifically for my use case. 
Any help, suggestion, contribution, criticism etc are welcome.

## Read before submitting a PR
- Its okay if your PR breaks the *zero dependency theme* as long as its worth it.
- Avoid JQuery, lodash, axios at all costs. Why? Everything they can do, vanilla JS can do with more code.
- Avoid loading scripts from cdns. Use NPM packages instead.  

For support feel free to create an [Issue](https://github.com/rishav394/1337-enhancer/issues)
