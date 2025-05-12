foam.CLASS({
  package: 'hughes.vss',
  name: 'ServiceSchedule',
  discription: '',
  implements: [
    'foam.core.auth.CreatedAware'
  ],
  requires: [
    'hughes.vss.MaintenanceVehicle'
  ],
  imports: [
    'maintenanceVehicleDAO'
  ],
  properties: [
    {
      name: 'id',
      class: 'String',
      visibility: 'HIDDEN'
    },
    {
      name: 'vehicle',
      class: 'Reference',
      of: 'hughes.vss.MaintenanceVehicle',
      tableCellFormatter:function(value, obj) {
        obj.maintenanceVehicleDAO
        .find(value)
        .then((maintenanceVehicle)=> this.add(maintenanceVehicle.toSummary()))
        .catch((error) => this.add(value));
      },
      visibility: 'RO'
    },
    {
      name: 'distance',
      class: 'Int',
      required: true,
      postSet: function (old,nu) {
        this.generateServiceItems();
      }
    },
    {
      name: 'serviceDate',
      class: 'Date'
    },
    {
      name: 'serviceItems',
      class: 'FObjectArray',
      of: 'hughes.vss.ServiceItem',
      visibility: 'RO'
    },
  ],
  method: [
    {
      name: 'generateServiceItems',
      code: function () {}
    }
]
})
