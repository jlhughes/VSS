foam.CLASS({
  package: 'hughes.vss',
  name: 'ServiceItem',
  discription: 'Maintenance item on a service schedule',
  imports: [
    'maintenanceItemDAO'
  ],
  properties: [
    {
      name: 'completed',
      class: 'Boolean'
    },
    {
      name: 'item',
      class: 'Reference',
      of: 'hughes.vss.MaintenanceItem',
      required: true,
      tableCellFormatter:function(value, obj) {
        obj.maintenanceItemDAO
        .find(value)
        .then((maintenanceItem)=> this.add(maintenanceItem.toSummary()))
        .catch((error) => this.add(value));
      }
    }
  ]
})
