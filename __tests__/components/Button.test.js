// __tests__/components/Button.test.js

import { mount } from '@vue/test-utils'; // Untuk mounting komponen
import { describe, it, expect, vi } from 'vitest'; // Fungsi pengujian Vitest
import Button from '../../src/components/common/Button.vue'; // Impor komponen Button

describe('Button.vue', () => {
  // Test Case 1: Komponen harus merender dengan slot content
  it('renders with default slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Klik Saya' // Mengirim 'Klik Saya' ke slot default
      }
    });
    expect(wrapper.text()).toContain('Klik Saya'); // Memastikan teks ada
  });

  // Test Case 2: Komponen harus menerapkan tipe default 'primary'
  it('applies primary type by default', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Test Button' }
    });
    expect(wrapper.classes()).toContain('btn-primary'); // Memastikan kelas btn-primary ada
    expect(wrapper.classes()).toContain('btn'); // Memastikan kelas btn dasar juga ada
  });

  // Test Case 3: Komponen harus menerapkan tipe 'secondary'
  it('applies secondary type when specified', () => {
    const wrapper = mount(Button, {
      props: { type: 'secondary' }, // Mengatur prop type ke 'secondary'
      slots: { default: 'Test Button' }
    });
    expect(wrapper.classes()).toContain('btn-secondary'); // Memastikan kelas btn-secondary ada
    expect(wrapper.classes()).not.toContain('btn-primary'); // Memastikan kelas default tidak ada
  });

  // Test Case 4: Komponen harus memancarkan event 'click' saat diklik
  it('emits a click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Test Button' }
    });
    await wrapper.trigger('click'); // Simulasikan klik pada tombol
    expect(wrapper.emitted().click).toHaveLength(1); // Memastikan event 'click' terpancar 1 kali
  });

  // Test Case 5: Tombol harus dinonaktifkan ketika prop 'disabled' true
  it('disables the button when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: { disabled: true }, // Mengatur prop disabled ke true
      slots: { default: 'Disabled Button' }
    });
    const buttonElement = wrapper.find('button');
    expect(buttonElement.element.disabled).toBe(true); // Memastikan atribut disabled ada
    expect(wrapper.classes()).toContain('btn-disabled'); // Memastikan kelas btn-disabled ada
  });

  // Test Case 6: Tombol yang dinonaktifkan tidak boleh memancarkan event 'click'
  it('does not emit click event when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Disabled Button' }
    });
    await wrapper.trigger('click'); // Simulasikan klik
    expect(wrapper.emitted().click).toBeUndefined(); // Memastikan event click tidak terpancar
  });

  // Test Case 7: Memastikan atribut type yang tidak valid ditangani (validator)
  // Catatan: validator prop di Vue akan memberikan warning di konsol, tapi test ini memastikan kelas tidak ditambahkan
  it('does not apply class for invalid type prop', () => {
    const wrapper = mount(Button, {
      props: { type: 'invalidType' }, // Memberikan tipe yang tidak valid
      slots: { default: 'Invalid Type' }
    });
    expect(wrapper.classes()).not.toContain('btn-invalidType');
    // Seharusnya masih memakai default 'btn-primary' jika validator mengembalikan nilai default,
    // tapi karena prop validator hanya memberi warning dan tidak mengubah prop,
    // kita tetap perlu memastikan kelas invalid tidak muncul
    expect(wrapper.classes()).toContain('btn-primary');
  });
});