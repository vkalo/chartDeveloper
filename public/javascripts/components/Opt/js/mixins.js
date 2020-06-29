import { enter, afterEnter, leave, afterLeave } from '../../../utils/animation.js';

export const mapTypeToCom = {
  text: 'OptText',
  number: 'OptNumber',
  range: 'OptRange',
  color: 'OptColor',
  image: 'OptImage',
  imageSelect: 'OptImageSelect',
  boolean: 'OptBoolean',
  select: 'OptSelect',
  group: 'OptGroup',
  array: 'OptArray',
  custom: 'OptCustom',
  default: 'OptUnknown',
};

export default {
  props: {
    config: Object,
    value: Object,
  },
  methods: {
    enter,
    afterEnter,
    leave,
    afterLeave,
  },
};
