'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdPictureAsPdf, MdClose } from 'react-icons/md'
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register Roboto font with Turkish character support
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Roboto'
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 700
  },
  menuCard: {
    marginBottom: 15,
    padding: 8,
    border: '0.5 solid #999'
  },
  menuTitle: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 12,
    marginBottom: 8,
    borderBottom: '0.5 solid #EEE',
    paddingBottom: 4
  },
  table: {
    display: 'table',
    width: '100%',
    fontSize: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5 solid #EEE',
    paddingVertical: 2
  },
  headerCell: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    padding: 2,
    flex: 1,
    color: '#666'
  },
  cell: {
    fontFamily: 'Roboto',
    padding: 2,
    flex: 1
  },
  costs: {
    marginTop: 6,
    textAlign: 'right',
    fontSize: 9,
    color: '#444'
  },
  total: {
    fontSize: 10,
    marginTop: 2,
    color: '#000',
    fontWeight: 700
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999'
  }
})

const formatPrice = (price) => {
  return `${typeof price === 'number' ? price.toFixed(2) : '0.00'} TL`
}

const MenuDocument = ({ menus }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Menü Maliyet Raporu</Text>
      {menus.map((menu, index) => (
        <View key={index} style={styles.menuCard}>
          <Text style={styles.menuTitle}>{menu.menuName}</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.headerCell, { flex: 2 }]}>Malzeme</Text>
              <Text style={styles.headerCell}>Miktar</Text>
              <Text style={styles.headerCell}>Fiyat</Text>
              <Text style={styles.headerCell}>KDV</Text>
            </View>
            
            {menu.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2 }]}>{ing.product.name}</Text>
                <Text style={styles.cell}>{ing.quantity}gr</Text>
                <Text style={styles.cell}>{formatPrice(ing.unitCost)}</Text>
                <Text style={styles.cell}>%{ing.product.vatRate || 0}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.costs}>
            <Text>KDV Hariç: {formatPrice(menu.baseCost)}</Text>
            <Text>+KDV: {formatPrice(menu.vatAmount)}</Text>
            <Text style={styles.total}>
              Toplam: {formatPrice(menu.totalCost)}
            </Text>
          </View>
        </View>
      ))}
      <Text style={styles.footer}>
        {new Date().toLocaleString('tr-TR', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })} tarihinde oluşturuldu
      </Text>
    </Page>
  </Document>
)

const PdfButton = ({ menus }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
      >
        <MdPictureAsPdf size={20} />
        PDF Görüntüle
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90vw] h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Menü PDF Önizleme</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={24} />
              </button>
            </div>
            <PDFViewer width="100%" height="100%">
              <MenuDocument menus={menus} />
            </PDFViewer>
          </div>
        </div>
      )}
    </>
  )
}

export default PdfButton