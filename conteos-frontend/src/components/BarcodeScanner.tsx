'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { FiCamera, FiX } from 'react-icons/fi'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'barcode-scanner',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          aspectRatio: 1.0,
        },
        false
      )

      scanner.render(
        (decodedText) => {
          // Success callback
          onScan(decodedText)
          scanner.clear()
          onClose()
        },
        (error) => {
          // Error callback (silent, just for debugging)
          // console.warn(error)
        }
      )

      scannerRef.current = scanner
      setIsScanning(true)
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
        scannerRef.current = null
      }
    }
  }, [onScan, onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiCamera className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Escanear Código de Barras</h2>
              <p className="text-sm text-gray-600 mt-1">
                Posiciona el código de barras frente a la cámara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6">
          <div 
            id="barcode-scanner" 
            className="rounded-lg overflow-hidden border-2 border-blue-200"
          />
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <FiCamera className="w-4 h-4 mr-2" />
              Instrucciones:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
              <li>Permite el acceso a la cámara cuando el navegador lo solicite</li>
              <li>Mantén el código de barras centrado en el cuadro</li>
              <li>Asegúrate de que haya buena iluminación</li>
              <li>Mantén la cámara estable para un mejor escaneo</li>
              <li>El código se capturará automáticamente al ser detectado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
