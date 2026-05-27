const cds = require('@sap/cds');

class LogisticsService extends cds.ApplicationService {
  async init() {

    this.after('READ', 'Shipments', async (shipments) => {

      if (!Array.isArray(shipments)) {
        shipments = [shipments];
      }
      // console.log('Shipments read:', shipments);

      for (const shipment of shipments) {
        const { ID } = shipment;
        const result = await cds.run(
          SELECT.from('Packages').where({ parent_ID: ID })
        );
        // console.log(`Packages for Shipment ${ID}:`, result);
        let sum = 0;
        for (const pkg of result) {
          sum += Number(pkg.weight);
        }
        // console.log(`Total weight for Shipment ${ID}:`, sum);

        const totalWeight = sum;
        shipment.totalWeight = totalWeight;

        let modifier = 0;
        switch (shipment.mode) {
          case 'Air':
            modifier = 15;
            break;
          case 'Sea':
            modifier = 5;
            break;
          case 'Rail':
            modifier = 8;
            break;
          default:
            modifier = 0;
            break;
        }
        // console.log(shipment.mode, modifier);
        shipment.shippingFee = totalWeight * modifier;
      }
    });



    await super.init();
  }
}

module.exports = LogisticsService;