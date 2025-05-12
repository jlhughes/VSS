foam.CLASS({
  package: 'hughes.vss',
  name: 'Vehicle',
  discription: 'Complete car/truck',
  implements: [
    { path: 'foam.mlang.Expressions', flags: ['js'] }
  ],
  requires: [
    'hughes.vss.Make',
    'hughes.vss.Model',
    'hughes.vss.ServiceSchedule'
  ],
  imports: [
    'makeDAO',
    'modelDAO',
    'routeTo',
    'serviceScheduleDAO'
  ],
  properties: [
    {
      name: 'id',
      class: 'String',
      visibility: 'HIDDEN'
    },
    {
      name: 'make',
      class: 'Reference',
      of: 'hughes.vss.Make',
      required: true,
      postSet: function (oldValue, newValue) {
        if (oldValue !== newValue) {
          this.model = undefined;
        }
      }
    },
    {
      name: 'model',
      class: 'Reference',
      of: 'hughes.vss.Model',
      required: true,
      view: function (_, X) {
        var choices = X.data.slot(function (make) {
          return X.modelDAO.where(X.data.EQ(X.data.Model.MAKE, make));
        });
        return foam.u2.view.ChoiceView.create({
          objToChoice: function (model) {
            return [model.id, model.name];
          },
          dao$: choices,
          placeholder: '--'
        }, X);
      },
      tableCellFormatter: function (value, obj) {
        this.__subSubContext__.modelDAO
          .find(value)
          .then((model) => this.add(model.name))
          .catch((error) => this.add(value));
      }
    },
    {
      name: 'year',
      class: 'Int',
      required: true
    },
    {
      name: 'trim',
      class: 'String',
      required: true
    },
    {
      name: 'colour',
      class: 'String',
      required: true
    },
    {
      name: 'vin',
      class: 'String'
    },
    {
      name: 'purchaseDate',
      class: 'Date',
      required: true
    },
    {
      name: 'purchaseKilometers',
      class: 'Int',
      required: true
    },
    {
      name: 'serviceScheduleMenu',
      class: 'String',
      value: 'serviceSchedule',
      transient: true,
      visibility: 'HIDDEN'
    }
  ],
  methods: [
    {
      name: 'toSummary',
      code: async function () {
        var self = this;
        return this.make$find.then(function (make) {
          return self.model$find.then(function (model) {
            var summary = make.id + ' ' + model.name;
            if (self.trim) summary += ' ' + self.trim;
            summary += ' ' + self.year;
            return summary;
          })
        });
      }
    }
  ],
  actions: [
    {
      name: 'createServiceSchedule',
      isAvaible: function(id) {
        return id;
      },
      code: function (X) {
        var self = this;
        var serviceSchedule = this.ServiceSchedule.create({
          vehicle: self.id
        });
        this.serviceScheduleDAO.put(serviceSchedule).then(function (s) {
          self.routeTo(self.serviceScheduleMenu + "/" + s.id);
        });
      }
    }
  ]
})
