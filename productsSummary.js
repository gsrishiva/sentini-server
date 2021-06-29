let productsData = [
    {
        "sNo": 649,
        "actualPrice": 5850,
        "dealDiscount": 5,
        "discountedPrice": "5557.50",
        "productTax": "1000.35",
        "productType": "SWR",
        "productCategory": "Solvents",
        "quantity": 15,
        "size": "1000ml",
        "item": "PVC Solvent Cement - Regular Clear"
    },
    {
        "sNo": 252,
        "actualPrice": 12,
        "dealDiscount": 5,
        "discountedPrice": "11.40",
        "productTax": "2.05",
        "productType": "UPVC",
        "productCategory": "Fittings",
        "quantity": 1,
        "size": "1/2\"",
        "item": "UPVC Plain Elbow 90°"
    },
    {
        "sNo": 7,
        "actualPrice": 1720,
        "dealDiscount": 5,
        "discountedPrice": "1634.00",
        "productTax": "294.12",
        "productType": "CPVC",
        "productCategory": "Pipes",
        "quantity": 5,
        "size": "1/2\"",
        "item": "SDR 11"
    },
    {
        "sNo": 208,
        "actualPrice": 400,
        "dealDiscount": 5,
        "discountedPrice": "380.00",
        "productTax": "68.40",
        "productType": "CPVC",
        "productCategory": "Solvents",
        "quantity": 5,
        "size": "29.5 ml Tube",
        "item": "Solvent Cement - Medium Duty Yellow"
    },
    {
        "sNo": 12,
        "actualPrice": 3070,
        "dealDiscount": 5,
        "discountedPrice": "2916.50",
        "productTax": "524.97",
        "productType": "CPVC",
        "productCategory": "Pipes",
        "quantity": 1,
        "size": "2\"",
        "item": "SDR 11"
    },
    {
        "sNo": 268,
        "actualPrice": 250,
        "dealDiscount": 5,
        "discountedPrice": "237.50",
        "productTax": "42.75",
        "productType": "UPVC",
        "productCategory": "Fittings",
        "quantity": 10,
        "size": "3/4\"",
        "item": "UPVC Plain Tee 90°"
    },
    {
        "sNo": 79,
        "actualPrice": 1040,
        "dealDiscount": 5,
        "discountedPrice": "988.00",
        "productTax": "177.84",
        "productType": "CPVC",
        "productCategory": "Fittings",
        "quantity": 10,
        "size": "1”",
        "sku_Description": "CPVC Ftngs Plain Cross Tee - 1\" (25mm) SDR 11",
        "item": "CPVC Plain Cross Tee"
    },
    {
        "sNo": 102,
        "actualPrice": 29.5,
        "dealDiscount": 5,
        "discountedPrice": "28.02",
        "productTax": "5.04",
        "productType": "CPVC",
        "productCategory": "Fittings",
        "quantity": 2,
        "size": "¾”x ¾”",
        "sku_Description": "CPVC Ftngs Plain Transition Bush - ¾” x ¾” (20mm x 20mm) SDR 11",
        "item": "CPVC Plain Transition bush\r\n(IPS X CTS)"
    },
    {
        "sNo": 128,
        "actualPrice": 255,
        "dealDiscount": 5,
        "discountedPrice": "242.25",
        "productTax": "43.60",
        "productType": "CPVC",
        "productCategory": "Fittings",
        "quantity": 5,
        "size": "1¼ ”",
        "sku_Description": "CPVC Ftngs Plain MTA - 1¼” (32mm) SDR 11",
        "item": "CPVC Plain MTA"
    },
    {
        "sNo": 211,
        "actualPrice": 2840,
        "dealDiscount": 5,
        "discountedPrice": "2698.00",
        "productTax": "485.64",
        "productType": "CPVC",
        "productCategory": "Solvents",
        "quantity": 8,
        "size": "237 ml Tin",
        "sku_Description": "CPVC Solvent Cement - Medium Duty Yellow 237ml Tin",
        "item": "Solvent Cement - Medium Duty Yellow"
    }
]


let CPVCpipes = []
let CPVCfittings = []
let CPVCsolvents = []
let UPVCpipes = []
let UPVCfittings = []
let UPVCsolvents = []
let SWRpipes = []
let SWRfittings = []
let SWRsolvents = []
let SWRlubricants = []
productsData.forEach(product => {
    // Group CPVC
    if (product.productType == 'CPVC') {
        if (product.productCategory == 'Pipes') {
            CPVCpipes.push(product)
        }
        if (product.productCategory == 'Fittings') {
            CPVCfittings.push(product)
        }
        if (product.productCategory == 'Solvents') {
            CPVCsolvents.push(product)
        }
    }
    // Group UPVC
    if (product.productType == 'UPVC') {
        if (product.productCategory == 'Pipes') {
            UPVCpipes.push(product)
        }
        if (product.productCategory == 'Fittings') {
            UPVCfittings.push(product)
        }
        if (product.productCategory == 'Solvents') {
            UPVCsolvents.push(product)
        }
    }
    // Group SWR
    if (product.productType == 'SWR') {
        if (product.productCategory == 'Pipes') {
            SWRpipes.push(product)
        }
        if (product.productCategory == 'Fittings') {
            SWRfittings.push(product)
        }
        if (product.productCategory == 'Solvents') {
            SWRsolvents.push(product)
        }
        if (product.productCategory == 'Lubricants') {
            SWRlubricants.push(product)
        }
    }
});
// CPVC CALCULATIONS
let CPVCpipesTotal = CPVCpipes.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let CPVCfittingsTotal = CPVCfittings.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let CPVCsolventsTotal = CPVCsolvents.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let CPVCtotal = parseFloat(CPVCpipesTotal) + parseFloat(CPVCfittingsTotal) + parseFloat(CPVCsolventsTotal)
let CPVCpipesPercentage = ((parseFloat(CPVCpipesTotal).toFixed(2) / CPVCtotal) * 100).toFixed(2)
let CPVCfittingsPercentage = ((parseFloat(CPVCfittingsTotal).toFixed(2) / CPVCtotal) * 100).toFixed(2)
let CPVCsolventsPercentage = ((parseFloat(CPVCsolventsTotal).toFixed(2) / CPVCtotal) * 100).toFixed(2)

// UPVC CALCULATIONS
let UPVCpipesTotal = UPVCpipes.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let UPVCfittingsTotal = UPVCfittings.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let UPVCsolventsTotal = UPVCsolvents.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let UPVCtotal = parseFloat(UPVCpipesTotal) + parseFloat(UPVCfittingsTotal) + parseFloat(UPVCsolventsTotal)
let UPVCpipesPercentage = ((parseFloat(UPVCpipesTotal).toFixed(2) / UPVCtotal) * 100).toFixed(2)
let UPVCfittingsPercentage = ((parseFloat(UPVCfittingsTotal).toFixed(2) / UPVCtotal) * 100).toFixed(2)
let UPVCsolventsPercentage = ((parseFloat(UPVCsolventsTotal).toFixed(2) / UPVCtotal) * 100).toFixed(2)

//SWR calculations
let SWRpipesTotal = SWRpipes.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let SWRfittingsTotal = SWRfittings.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let SWRsolventsTotal = SWRsolvents.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
let SWRlubricantsTotal = SWRlubricants.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);

let SWRtotal = parseFloat(SWRpipesTotal) + parseFloat(SWRfittingsTotal) + parseFloat(SWRsolventsTotal) + parseFloat(SWRlubricantsTotal)
let SWRpipesPercentage = ((parseFloat(SWRpipesTotal).toFixed(2) / SWRtotal) * 100).toFixed(2)
let SWRfittingsPercentage = ((parseFloat(SWRfittingsTotal).toFixed(2) / SWRtotal) * 100).toFixed(2)
let SWRsolventsPercentage = ((parseFloat(SWRsolventsTotal).toFixed(2) / SWRtotal) * 100).toFixed(2)
let SWRlubricantsPercentage = ((parseFloat(SWRlubricantsTotal).toFixed(2) / SWRtotal)).toFixed(2)


let salesOrderSummary = []
let CPVCsummary = {
    prices: {
        CPVCpipesTotal: { total: parseFloat(CPVCpipesTotal).toFixed(2), discount: CPVCpipesPercentage },
        CPVCfittingsTotal: { total: parseFloat(CPVCfittingsTotal).toFixed(2), discount: CPVCfittingsPercentage },
        CPVCsolventsTotal: { total: parseFloat(CPVCsolventsTotal).toFixed(2), discount: CPVCsolventsPercentage }
    }
}
salesOrderSummary.push({ 'CPVC': CPVCsummary })
let UPVCsummary = {
    prices: {
        UPVCpipesTotal: { total: parseFloat(UPVCpipesTotal).toFixed(2), discount: UPVCpipesPercentage },
        UPVCfittingsTotal: { total: parseFloat(UPVCfittingsTotal).toFixed(2), discount: UPVCfittingsPercentage },
        UPVCsolventsTotal: { total: parseFloat(UPVCsolventsTotal).toFixed(2), discount: UPVCsolventsPercentage }
    }
}
salesOrderSummary.push({ 'UPVC': UPVCsummary })
let SWRsummary = {
    prices: {
        SWRpipesTotal: { total: parseFloat(SWRpipesTotal).toFixed(2), discount: SWRpipesPercentage },
        SWRfittingsTotal: { total: parseFloat(SWRfittingsTotal).toFixed(2), discount: SWRfittingsPercentage },
        SWRsolventsTotal: { total: parseFloat(SWRsolventsTotal).toFixed(2), discount: SWRsolventsPercentage },
        SWRlubricantsTotal: { total: parseFloat(SWRlubricantsPercentage).toFixed(2), discount: SWRlubricantsPercentage }
    },
}
salesOrderSummary.push({ 'SWR': SWRsummary })

console.log('====== SALES ORDER SUMMARY')
console.log(salesOrderSummary)

salesOrderSummary.forEach(element => {
    for (let [key, value] of Object.entries(element)) {
        for (let [category, categoryValue] of Object.entries(value)) {
            if (category == 'prices') {
                // print price key and value PLUS discount value
                for (let [priceName, priceValue] of Object.entries(categoryValue)) {
                    console.log(`${priceName}: ${Object.values(priceValue)[0]}  ${Object.values(priceValue)[1]} `);
                }
            }
            // console.log(`${category}: ${categoryValue}`);
        }
    }
});