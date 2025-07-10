// __tests__/components/Card.test.js

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Card from '../../src/components/common/Card.vue'; // Impor komponen Card

describe('Card.vue', () => {
  // Test Case 1: Merender dengan slot default (body content)
  it('renders with default slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<p>Konten Utama Kartu</p>' // Mengirim HTML ke slot default
      }
    });
    expect(wrapper.find('.card-body').html()).toContain('<p>Konten Utama Kartu</p>');
  });

  // Test Case 2: Merender dengan slot header
  it('renders with header slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<h3>Judul Kartu</h3>' // Mengirim HTML ke slot header
      }
    });
    expect(wrapper.find('.card-header').html()).toContain('<h3>Judul Kartu</h3>');
    expect(wrapper.find('.card-header').exists()).toBe(true); // Memastikan elemen header ada
  });

  // Test Case 3: Merender dengan slot footer
  it('renders with footer slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        footer: '<span>Ini adalah footer</span>' // Mengirim HTML ke slot footer
      }
    });
    expect(wrapper.find('.card-footer').html()).toContain('<span>Ini adalah footer</span>');
    expect(wrapper.find('.card-footer').exists()).toBe(true); // Memastikan elemen footer ada
  });

  // Test Case 4: Tidak merender header jika slot header kosong
  it('does not render header section if header slot is empty', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'Body Content'
        // header slot tidak diberikan
      }
    });
    expect(wrapper.find('.card-header').exists()).toBe(false); // Memastikan elemen header tidak ada
  });

  // Test Case 5: Tidak merender footer jika slot footer kosong
  it('does not render footer section if footer slot is empty', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'Body Content'
        // footer slot tidak diberikan
      }
    });
    expect(wrapper.find('.card-footer').exists()).toBe(false); // Memastikan elemen footer tidak ada
  });

  // Test Case 6: Merender gambar ketika imageUrl prop diberikan
  it('renders image when imageUrl prop is provided', () => {
    const imageUrl = 'http://example.com/test.jpg';
    const imageAlt = 'Gambar Uji';
    const wrapper = mount(Card, {
      props: { imageUrl, imageAlt },
      slots: { default: 'Body' }
    });
    const img = wrapper.find('.card-image');
    expect(img.exists()).toBe(true); // Memastikan elemen img ada
    expect(img.attributes('src')).toBe(imageUrl); // Memastikan src atribut benar
    expect(img.attributes('alt')).toBe(imageAlt); // Memastikan alt atribut benar
  });

  // Test Case 7: Tidak merender container gambar jika imageUrl tidak diberikan
  it('does not render image container if imageUrl is not provided', () => {
    const wrapper = mount(Card, {
      slots: { default: 'Body' }
    });
    expect(wrapper.find('.card-image-container').exists()).toBe(false); // Memastikan container gambar tidak ada
  });

  // Test Case 8: Menerapkan kelas hover effect jika prop hoverEffect true
  it('applies hover effect class when hoverEffect prop is true', () => {
    const wrapper = mount(Card, {
      props: { hoverEffect: true },
      slots: { default: 'Body' }
    });
    expect(wrapper.classes()).toContain('card-hover'); // Memastikan kelas card-hover ada
  });

  // Test Case 9: Tidak menerapkan kelas hover effect jika prop hoverEffect false/tidak ada
  it('does not apply hover effect class when hoverEffect prop is false or not provided', () => {
    const wrapper = mount(Card, {
      props: { hoverEffect: false },
      slots: { default: 'Body' }
    });
    expect(wrapper.classes()).not.toContain('card-hover'); // Memastikan kelas card-hover tidak ada
    
    const wrapperNoProp = mount(Card, {
      slots: { default: 'Body' }
    });
    expect(wrapperNoProp.classes()).not.toContain('card-hover');
  });
});