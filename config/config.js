module.exports = {
  APP_URL: "http://182.156.90.3:9000/",
  //   [{
  //     "Id": "1",
  //     "Name": "telangana",
  //     "Parent": "",
  //     "children": [{

  //         "Id": "2",
  //         "Name": "nizamabad",
  //         "Parent": "1",
  //         "attr": "abc"       
  //     }],
  //     "children": [{

  //         "Id": "2",
  //         "Name": "armoor",
  //         "Parent": "1",
  //         "attr": "abc"       
  //     }]
  // }]
  storageOption: "local", // local OR s3
  aws: {
    AWS_ACCESS_KEY_ID: "AKIAIABBV3ZUN4IL5SDQ",
    AWS_SECRET_ACCESS_KEY_ID: "7JlII1NuWIXJbIlhj2SoVCDzGPiSYoVfAvQ8pDI0",
    BUCKET_NAME: "sentini",
  },
  jwt: {
    secret: "656asda4s6d4adgg21313",
  },
  mail: {
    config: {
      smtpHost: "pop.cloudzimail.com",
      smtpPort: 587,
      smtpSecurity: false,
      smtpUser: "orderportal@sentiniflopipes.com",
      smtpPassword: "Sfpl@1122",
    },
    orderEmail: {
      subject: "Order placed successfully - SENTINI",
      fromEmail: "orderportal@sentiniflopipes.com",
      pdfFormat: [
        "nvtaduri@softility.com",
        //"avinash.gl@sentiniflopipes.com",
        //"salesorder@sentiniflopipes.com",
      ],
      //excelFormat: ["smfa@pipes.sentinigroup.com"]
      excelFormat: ["nvtaduri@softility.com"]
    },
  },
};
