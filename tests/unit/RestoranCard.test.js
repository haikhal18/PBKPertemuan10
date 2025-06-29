import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RestoranCard from '@/components/RestoranCard.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'

// Mock router untuk testing navigasi
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/restaurants/:id', name: 'DetailRestaurant', component: { template: 'Detail' } }]
})

describe('RestoranCard.vue', () => {
  const sampleRestaurant = {
    id: 1,
    name: 'Sate Kambing Pak Kumis',
    description: 'Sate terenak di kota',
    address: 'Jl. Makan Enak No.1',
    image: 'https://example.com/sate.jpg',
    verified: true
  }

  it('menampilkan nama, deskripsi, dan gambar restoran', () => {
    const wrapper = mount(RestoranCard, {
      props: {
        restaurant: sampleRestaurant
      },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    expect(wrapper.text()).toContain(sampleRestaurant.name)
    expect(wrapper.text()).toContain(sampleRestaurant.description)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(sampleRestaurant.image)
  })

  it('memunculkan status "Terverifikasi" jika verified true', () => {
    const wrapper = mount(RestoranCard, {
      props: {
        restaurant: sampleRestaurant
      },
      global: {
        plugins: [createTestingPinia()]
      }
    })

    expect(wrapper.text()).toContain('Terverifikasi')
  })

  it('navigasi ke halaman detail saat tombol diklik', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(RestoranCard, {
      props: { restaurant: sampleRestaurant },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(router.currentRoute.value.fullPath).toBe(`/restaurants/${sampleRestaurant.id}`)
  })
})