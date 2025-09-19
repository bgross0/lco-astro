'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const categories = [
  {
    name: 'Skid Steers',
    icon: '/259d3.png',
    emoji: '🏗️', // Fallback emoji if image doesn't exist
    description: 'Compact track and wheel loaders',
    link: '/equipment/skid-steers',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Excavators',
    icon: '/35g.png',
    emoji: '🦾',
    description: 'Mini and compact excavators',
    link: '/equipment/excavators',
    color: 'from-gray-600 to-gray-800',
  },
  {
    name: 'Trailers',
    icon: '/bigtexdump14.png',
    emoji: '🚛',
    description: 'Equipment and dump trailers',
    link: '/equipment/trailers',
    color: 'from-blue-600 to-blue-800',
  },
  {
    name: 'Power Tools',
    icon: '/MS-391.png',
    emoji: '🔧',
    description: 'Chainsaws, generators, compressors',
    link: '/equipment/power-tools',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Loaders',
    icon: '/938m.png',
    emoji: '🚜',
    description: 'Wheel loaders and backhoes',
    link: '/equipment/loaders',
    color: 'from-green-600 to-green-800',
  },
  {
    name: 'Attachments',
    icon: '/skidgrapple.png',
    emoji: '🔗',
    description: 'Grapples, buckets, and more',
    link: '/equipment/attachments',
    color: 'from-red-500 to-red-700',
  },
]

function CategoryCard({ category }: { category: typeof categories[0] }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={category.link}
      className="group card hover:scale-105 transform transition-all duration-300"
    >
      <div className="h-32 bg-white relative overflow-hidden">
        {!imageError ? (
          <Image
            src={category.icon}
            alt={category.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{category.emoji}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-neutral-medium">{category.description}</p>
        <div className="mt-4 text-primary font-semibold flex items-center">
          Browse {category.name}
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function EquipmentCategories() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Equipment Categories</h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Find the right tools for your project. All equipment is professionally maintained and ready to work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}