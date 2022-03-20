const sideBarItems = require("../sidebars.js")
const glob = require("glob");

var getFilePaths = (src, callback) => {
    glob(src + '/**/*.md*', callback);
};

const extractItemsFromSidebar = (data, outputArray) => {
    data.forEach(element => {
        if (element.items != undefined) {
            extractItemsFromSidebar(element.items, outputArray);
        } else {
            outputArray.push(element);
        }
    });
}

test("Should not have pages outside sidebar", done => {
    return getFilePaths('./docs', (err, filePaths) => {
        let danglingPages = []
        try {
            if (err) {
                done(err);
            } else {
                let modifiedFilePaths = [];

                // remove root folder from file path and file extension
                for (let filepath of filePaths) {
                    let modifiedFilePath= filepath.substring(7).replace(/(.mdx|.md)$/, "");
                    modifiedFilePaths.push(modifiedFilePath)
                }

                var filePathsFromSidebar = [];

                //Extract individual file paths from sidebar tree
                extractItemsFromSidebar(sideBarItems.develop, filePathsFromSidebar);

                //Find dangling files
                for (const filePath of modifiedFilePaths) {
                    if (filePathsFromSidebar.indexOf(filePath) == -1) {
                        danglingPages.push(filePath)
                    }
                }
                expect(danglingPages.length).toEqual(0);
                done();
            }
        } catch (error) {
            if(error.matcherResult != undefined){
                error = new Error("Not all files are in the sidebar tree: \n\n" + danglingPages.join('\n').toString())
            }
            done(error);
        }

    });
});