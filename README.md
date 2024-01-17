# herond-filter-list
Herond Filter List - Extends ABPVN 
- This repo is to create the Herond filter list to use for ad-block of Herond Browser
- This repo includes a submodule that fetches from ABPVN at https://github.com/abpvn/abpvn
- Filter list file created by combining ads block rules of Herond and ABPVN

## Fetch code
- Clone this repo by command: `git clone git@github.com:herondlabs/herond-filter-list.git`
- At `herond-filter-list` folder, run `git submodule update --init --recursive` to fetch code of the `abpvn` repo
- To update the latest code of the submodule, run `git submodule update --recursive --remote`

## Create a component and pack it into a CRX file
1. Update rules in `filter/herond_list.txt` file
2. Pull the latest code of the submodule: `git submodule update --recursive --remote`
3. Run `npm install` to download necessary dependencies
4. Run command `npm run build -- -e <executable-herond-file> -k <private-key> -p <publisher-key> -v <version>`

where:
- `executable-herond-file` is the full path to the Herond web browser binary, used for packing the CRX files, default on Windows is "C:\Program Files\HerondLabs\Herond-Browser\Application\herond.exe"
- `private-key` is the path of the associated private key of extension
- `publisher-key` is the private key of Herond to sign for all extensions
- `version` is the extension version 

NOTE: Use the absolute path

Example: 

`npm run build -- -e "C:\Program Files\HerondLabs\Herond-Browser\Application\herond.exe" -k "C:\herond-filter-list\keys\private.pem" -p "C:\herond-filter-list\keys\publisher_key.pem" -v 1.0.1`

Output CRX file will be created at `herond-filter-list\build\<extension-componentid>` folder

Also can create CRX from any extension directory by command line:

`npm run gen_crx -- -e <executable-herond-file> -d <extension-dir> -k <private-key> -p <publisher-key>`

with:

- `extension-dir` is the directory containing the files of extension's component