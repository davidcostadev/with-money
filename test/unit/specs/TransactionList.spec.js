import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import TransactionList from '../../../src/pages/TransactionList';
import store from '../../../src/store';
import router from '../../../src/router';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueMaterial);
localVue.use(VueRouter);

const Category = {
  name: 'Lanche',
};

const transactions = [
  {
    id: 3,
    AccountId: 1,
    name: 'AlmoçoAlmoço 2',
    value: '15.00',
    type: 'out',
    isPaid: false,
    transactionDate: '2018-07-02',
    createdAt: '2018-08-04T21:26:56.000Z',
    updatedAt: '2018-08-04T21:27:07.000Z',
    Category,
  },
  {
    id: 2,
    AccountId: 2,
    name: 'Coxinha',
    value: '3.13',
    type: 'out',
    isPaid: false,
    transactionDate: '2018-08-04',
    createdAt: '2018-08-04T19:08:54.000Z',
    updatedAt: '2018-08-04T19:08:54.000Z',
    Category,
  },
  {
    id: 1,
    AccountId: 1,
    name: 'Lanche na Sonia',
    value: '30.90',
    type: 'out',
    isPaid: true,
    transactionDate: '2018-08-04',
    createdAt: '2018-08-04T19:08:54.000Z',
    updatedAt: '2018-08-04T19:08:54.000Z',
    Category,
  },
];

const mock = {
  data: transactions,
  pagination: {
    totalItems: 3,
    currentPage: 1,
    perPage: 100,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
  },
};

jest.mock('../../../src/services/transactions', () => ({
  getTransactions: () => Promise.resolve(mock),
}));

describe('TransactionList Component', () => {
  beforeAll(() => {
    global.localStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({
        id: '1',
        name: 'name',
      })),
    };
  });

  describe('Render', () => {
    it('default', () => {
      const wrapper = shallowMount(TransactionList, { store, localVue, router });

      expect(wrapper.isVueInstance).toBeTruthy();
      expect(wrapper.element).toMatchSnapshot();
    });

    it('with transactions', () => {
      const stubs = {
        MdTab: '<div class="md-tab-stubbed" />',
      };

      const wrapper = mount(TransactionList, { stubs, store, localVue, router });
      wrapper.setData({
        transactions,
      });

      expect(wrapper.isVueInstance).toBeTruthy();
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
