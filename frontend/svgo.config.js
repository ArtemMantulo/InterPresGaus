module.exports = {
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: { removeViewBox: false },
            },
        },
    ],

    // plugins: [
    //     {
    //         name: "preset-default",
    //         params: {
    //             overrides: {
    //                 inlineStyles: {
    //                     onlyMatchedOnce: false,
    //                 },
    //                 removeDoctype: false,
    //                 removeViewBox: false,
    //                 // clenupIds: false,
    //             },
    //         },
    //     },
    // ],
};
