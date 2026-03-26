import React, { forwardRef } from 'react'
import logo from '@/assets/logo.png'
import styles from './PrintableInvoice.module.css'

const fmt = n => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const PrintableInvoice = forwardRef(({ data }, ref) => {
  if (!data) return null

  const {
    invoiceNumber,
    createdAt,
    patient,
    items = [],
    totalAmount,
    discountAmount,
    netAmount,
    paidAmount,
    outstandingAmount,
    status
  } = data

  const dateStr = new Date(createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div ref={ref} className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <div>
            <h1 className={styles.clinicName}>Gynaecare</h1>
            <p className={styles.clinicSub}>Women's Health & Fertility Center</p>
          </div>
        </div>
        <div className={styles.contact}>
          <p>Plot No. 12, Sector 5, Near City Hospital</p>
          <p>New Delhi - 110001</p>
          <p>Phone: +91 98765 43210</p>
          <p>Email: contact@gynaecare.com</p>
          <p className={styles.gstin}>GSTIN: 07AAAAA0000A1Z5</p>
        </div>
      </div>

      <div className={styles.titleRow}>
        <h2 className={styles.title}>TAX INVOICE</h2>
        <div className={styles.statusBadge} data-status={status}>
          {status?.toUpperCase()}
        </div>
      </div>

      {/* Info Row */}
      <div className={styles.infoRow}>
        <div className={styles.patientInfo}>
          <h3 className={styles.sectionTitle}>BILL TO</h3>
          <p className={styles.patientName}>{patient?.name}</p>
          {/* <p>ID: {patient?.id?.slice(0, 8)}</p> */}
          <p>Phone: {patient?.phone || '—'}</p>
          {patient?.dob && (
            <p>Age: {Math.floor((Date.now() - new Date(patient.dob)) / (365.25 * 86400000))} yrs</p>
          )}
        </div>
        <div className={styles.invoiceInfo}>
          <div className={styles.metaField}>
            <span>Invoice No:</span>
            <strong>{invoiceNumber}</strong>
          </div>
          <div className={styles.metaField}>
            <span>Date:</span>
            <strong>{dateStr}</strong>
          </div>
          <div className={styles.metaField}>
            <span>Place of Supply:</span>
            <strong>Delhi (07)</strong>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th>Description / Service</th>
            <th style={{ textAlign: 'center' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Rate</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                <div className={styles.itemName}>{item.description}</div>
                <div className={styles.itemCategory}>{item.category?.toUpperCase()}</div>
              </td>
              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right' }}>{fmt(item.unitPrice)}</td>
              <td style={{ textAlign: 'right' }}>{fmt(item.totalAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Row */}
      <div className={styles.summaryRow}>
        <div className={styles.notes}>
          <h3 className={styles.sectionTitle}>Notes / Terms</h3>
          <p>1. Healthcare services are currently GST exempt in India.</p>
          <p>2. This is a computer-generated invoice and does not require a physical signature.</p>
          <p>3. Please keep this invoice for future reference and follow-ups.</p>
        </div>
        <div className={styles.totals}>
          <div className={styles.totalLine}>
            <span>Subtotal</span>
            <span>{fmt(totalAmount)}</span>
          </div>
          {Number(discountAmount) > 0 && (
            <div className={styles.totalLine}>
              <span>Discount</span>
              <span>- {fmt(discountAmount)}</span>
            </div>
          )}
          <div className={`${styles.totalLine} ${styles.grandTotal}`}>
            <span>Grand Total</span>
            <span>{fmt(netAmount)}</span>
          </div>
          <div className={styles.totalLine}>
            <span>Amount Paid</span>
            <span>{fmt(paidAmount)}</span>
          </div>
          {Number(outstandingAmount) > 0 && (
            <div className={`${styles.totalLine} ${styles.due}`}>
              <span>Balance Due</span>
              <span>{fmt(outstandingAmount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.invoiceFooter}>
        <div className={styles.thanks}>Thank you for choosing Gynaecare!</div>
        <div className={styles.regInfo}>Registered Medical Practitioner · Dr. Sharma · MBBS, MD</div>
      </div>
    </div>
  )
})

PrintableInvoice.displayName = 'PrintableInvoice'

export default PrintableInvoice
