class ProductsService {
    constructor() {

    }

    async calculateProductsSummary(productsData) {
        productsData.forEach(element => {
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
        return new Promise((resolve, reject) => {
            try {
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
                let UGDpipes = []
                let UGDfittings = []
                let UGDsolvents =[]
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

                    //Group UGD
                    if (product.productType == 'UGD') {
                        if (product.productCategory == 'Pipes') {
                            UGDpipes.push(product)
                        }
                        if (product.productCategory == 'Fittings') {
                            UGDfittings.push(product)
                        }
                        if (product.productCategory == 'Solvents') {
                            UGDsolvents.push(product)
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

                //UGD calculations
                // CPVC CALCULATIONS
                let UGDpipesTotal = UGDpipes.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
                let UGDfittingsTotal = UGDfittings.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
                let UGDsolventsTotal = UGDsolvents.reduce((a, { discountedPrice }) => a + parseFloat(discountedPrice), 0);
                let UGDtotal = parseFloat(UGDpipesTotal) + parseFloat(UGDfittingsTotal) + parseFloat(UGDsolventsTotal)
                let UGDpipesPercentage = ((parseFloat(UGDpipesTotal).toFixed(2) / UGDtotal) * 100).toFixed(2)
                let UGDfittingsPercentage = ((parseFloat(UGDfittingsTotal).toFixed(2) / UGDtotal) * 100).toFixed(2)
                let UGDsolventsPercentage = ((parseFloat(UGDsolventsTotal).toFixed(2) / UGDtotal) * 100).toFixed(2)


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
                let UGDsummary = {
                    prices: {
                        UGDpipesTotal: { total: parseFloat(UGDpipesTotal).toFixed(2), discount: UGDpipesPercentage },
                        UGDfittingsTotal: { total: parseFloat(UGDfittingsTotal).toFixed(2), discount: UGDfittingsPercentage },
                        UGDsolventsTotal: { total: parseFloat(UGDsolventsTotal).toFixed(2), discount: UGDsolventsPercentage }
                    }
                }
                salesOrderSummary.push({ 'UGD': UGDsummary })
                resolve(salesOrderSummary)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = new ProductsService()