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
3. Update version in `VERSION` file
4. Run `npm install` to download necessary dependencies
5. Run command `npm run gen_herond_list -- --executable_herond=<executable-herond-file> --private_key=<private-key> --publisher_key=<publisher-key>`

where:
- `executable-herond-file` is the full path to the Herond web browser binary, used for packing the CRX files, default on Windows is "C:\Program Files\HerondLabs\Herond-Browser\Application\herond.exe"
- `private-key` is the path of the associated private key of extension
- `publisher-key` is the private key of Herond to sign for all extensions

NOTE: Use the absolute path

Example: 

`npm run gen_herond_list -- --executable_herond="C:\Program Files\HerondLabs\Herond-Browser\Application\herond.exe" --private_key="C:\herond-filter-list\keys\private.pem" --publisher_key="C:\herond-filter-list\keys\publisher_key.pem"`

Output CRX file will be created at `herond-filter-list\build\<extension-componentid>` folder

Also can create CRX from any extension directory by command line:

`npm run gen_crx -- --executable_herond=<executable-herond-file> --extension_dir=<extension-dir> --private_key=<private-key> --publisher_key=<publisher-key>`

with:

- `extension-dir` is the directory containing the files of extension's component