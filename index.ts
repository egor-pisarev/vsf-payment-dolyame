import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { isServer } from '@vue-storefront/core/helpers'
import Vue from 'vue'
import InfoComponent from './components/Info.vue'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { module } from './store'

export const DolyamePaymentModule: StorefrontModule = function({ store, router, moduleConfig }) {

  store.registerModule('dolyame', module)

  let correctPaymentMethod = false
  const placeOrder = () => {
    if (correctPaymentMethod) {
      console.log('before Place Order')
    }
  }

  let paymentMethodConfig = {
    'title': 'Долями',
    'code': 'dolyame',
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': false,
    'is_server_method': true
  }

  store.dispatch('checkout/addPaymentMethod', paymentMethodConfig)

  if (!isServer) {
    // Update the methods
    let paymentMethodConfig = {
      'title': 'Долями',
      'code': 'dolyame',
      'cost': 0,
      'costInclTax': 0,
      'default': false,
      'offline': false,
      'is_server_method': true
    }
    store.dispatch('checkout/addPaymentMethod', paymentMethodConfig)

    EventBus.$on('checkout-before-placeOrder', placeOrder)
    EventBus.$on('order-after-placed', ({ order, confirmation }) => {

      if (correctPaymentMethod && confirmation && confirmation.providerId) {

        const items = order.products.map(item => ({
          price: item.price,
          quantity: item.qty,
          name: item.name
        }))

        const amount = store.getters['cart/getTotals'].find(
          (i) => i.code === 'grand_total'
        ).value
        const cartId = store.getters['cart/getCartToken']

        store.dispatch('dolyame/create', { amount, cartId, items }).then(({ result }) => {
          if(result.result.status === 'new'){
            window.location.href = result.result.link
          }
        })
      }
    })
    // Mount the info component when required.
    EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      let methods = store.state['payment-backend-methods'].methods
      if (methods) {
        let method = methods.find(item => (item.code === paymentMethodCode))

        if (paymentMethodCode === 'dolyame' && typeof method !== 'undefined') {
          correctPaymentMethod = true
          // Dynamically inject a component into the order review section (optional)
          const Component = Vue.extend(InfoComponent)
          const componentInstance = (new Component())
          componentInstance.$mount('#checkout-order-review-additional')
        } else {
          correctPaymentMethod = false
        }
      }
    })
  }
}
