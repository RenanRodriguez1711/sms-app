import { useState, useEffect } from 'react'
import { Button } from './app/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './app/components/ui/Card'
import { Badge } from './app/components/ui/Badge'
import { Label } from './app/components/ui/Label'
import { Switch } from './app/components/ui/Switch'
import { Input } from './app/components/ui/Input'
import { Slider } from './app/components/ui/Slider'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './app/components/ui/Accordion'
import { ContactInput } from './app/components/ContactInput'
import { useDeviceConfig } from './app/hooks/useDeviceConfig'
import { generateSMS, openSMS } from './app/utils/smsGenerator'
import { DeviceParams } from './types/device'
import { Battery, MapPin, Info, Signal, Share2, Copy, Check } from 'lucide-react'
import './index.css'

type ViewType = 'menu' | 'contacts' | 'battery' | 'fall' | 'speed'

function App() {
  // Phase 1: URL Parameter Parsing
  const [deviceParams, setDeviceParams] = useState<DeviceParams | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('menu')
  const [copied, setCopied] = useState(false)
  const [confirmingQuery, setConfirmingQuery] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const phone = params.get('phone') || ''
    const name = params.get('name') || ''
    const model = params.get('model') || ''

    if (!phone) {
      setDeviceParams(null)
      return
    }

    setDeviceParams({ phone, name, model })
  }, [])

  // Phase 2: Persistent State with localStorage
  const { config, isLoaded, updateContact, updateBatteryLow, updateFallAlert, updateSpeedAlert } = useDeviceConfig(
    deviceParams?.phone || ''
  )

  if (!deviceParams) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Error: Parámetro faltante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-muted-foreground">
              Se requiere un número de teléfono para usar esta aplicación.
            </p>
            <p className="text-base text-muted-foreground">
              Ejemplo: <code className="bg-muted px-2 py-1 rounded">?phone=1155443322&name=Juan&model=GT06</code>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>
  }

  // Helper functions
  const handleCopyPhone = () => {
    navigator.clipboard.writeText(deviceParams.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const url = `${window.location.origin}?phone=${deviceParams.phone}&name=${encodeURIComponent(deviceParams.name)}&model=${encodeURIComponent(deviceParams.model)}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendSMS = (commandType: any, configValue: any) => {
    const message = generateSMS(commandType, configValue)
    if (message) {
      openSMS(deviceParams.phone, message)
    }
  }

  // Query command handler
  const handleQuerySMS = (queryType: string) => {
    const message = generateSMS(queryType as any, {})
    if (message) {
      openSMS(deviceParams.phone, message)
      setConfirmingQuery(null)
    }
  }

  // Render Header
  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-card border-b-2 border-border h-20 px-6 py-4 z-50 shadow-sm">
      <div className="max-w-2xl mx-auto h-full flex flex-col justify-center gap-2">
        <h1 className="text-2xl font-bold text-foreground">{deviceParams.name || 'Dispositivo'}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-base text-muted-foreground">Dispositivo: {deviceParams.model}</p>
          <Badge variant="outline" className="cursor-pointer" onClick={handleCopyPhone}>
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copiado' : deviceParams.phone}
          </Badge>
        </div>
      </div>
    </header>
  )

  // Render Main Menu
  const renderMenu = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Configuración</h2>
        <p className="text-base text-muted-foreground">Seleccione qué desea configurar en el dispositivo</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setCurrentView('contacts')}
          className="p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-md transition-all active:scale-95 min-h-24 text-left"
        >
          <h3 className="text-lg font-bold text-foreground">Contactos de Emergencia</h3>
          <p className="text-base text-muted-foreground mt-2">Agregar hasta 5 números</p>
        </button>

        <button
          onClick={() => setCurrentView('battery')}
          className="p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-md transition-all active:scale-95 min-h-24 text-left"
        >
          <h3 className="text-lg font-bold text-foreground">Alerta de Batería Baja</h3>
          <p className="text-base text-muted-foreground mt-2">Notificación cuando baje el porcentaje</p>
        </button>

        <button
          onClick={() => setCurrentView('fall')}
          className="p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-md transition-all active:scale-95 min-h-24 text-left"
        >
          <h3 className="text-lg font-bold text-foreground">Alerta de Caída</h3>
          <p className="text-base text-muted-foreground mt-2">Detectar cuando se cae el dispositivo</p>
        </button>

        <button
          onClick={() => setCurrentView('speed')}
          className="p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-md transition-all active:scale-95 min-h-24 text-left"
        >
          <h3 className="text-lg font-bold text-foreground">Alerta de Velocidad Máxima</h3>
          <p className="text-base text-muted-foreground mt-2">Límite de velocidad permitida</p>
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Consultas Rápidas</h2>
        <p className="text-base text-muted-foreground">Obtenga información del dispositivo al instante</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <button
            onClick={() => setConfirmingQuery('battery')}
            className="w-full aspect-square bg-card border-2 border-border rounded-lg hover:border-accent hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-3 p-4"
          >
            <Battery className="w-10 h-10 text-accent" />
            <span className="text-base font-semibold text-foreground">Ver Batería</span>
          </button>
          {confirmingQuery === 'battery' && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-40">
              <div className="bg-background p-4 rounded-lg text-center border-2 border-primary">
                <p className="text-base font-semibold mb-3">¿Enviar consulta?</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleQuerySMS('query-battery')}>Sí</Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmingQuery(null)}>No</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setConfirmingQuery('location')}
            className="w-full aspect-square bg-card border-2 border-border rounded-lg hover:border-accent hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-3 p-4"
          >
            <MapPin className="w-10 h-10 text-accent" />
            <span className="text-base font-semibold text-foreground">Ver Ubicación</span>
          </button>
          {confirmingQuery === 'location' && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-40">
              <div className="bg-background p-4 rounded-lg text-center border-2 border-primary">
                <p className="text-base font-semibold mb-3">¿Enviar consulta?</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleQuerySMS('query-location')}>Sí</Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmingQuery(null)}>No</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setConfirmingQuery('status')}
            className="w-full aspect-square bg-card border-2 border-border rounded-lg hover:border-accent hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-3 p-4"
          >
            <Info className="w-10 h-10 text-accent" />
            <span className="text-base font-semibold text-foreground">Ver Estado</span>
          </button>
          {confirmingQuery === 'status' && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-40">
              <div className="bg-background p-4 rounded-lg text-center border-2 border-primary">
                <p className="text-base font-semibold mb-3">¿Enviar consulta?</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleQuerySMS('query-status')}>Sí</Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmingQuery(null)}>No</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setConfirmingQuery('signal')}
            className="w-full aspect-square bg-card border-2 border-border rounded-lg hover:border-accent hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-3 p-4"
          >
            <Signal className="w-10 h-10 text-accent" />
            <span className="text-base font-semibold text-foreground">Ver Señal</span>
          </button>
          {confirmingQuery === 'signal' && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-40">
              <div className="bg-background p-4 rounded-lg text-center border-2 border-primary">
                <p className="text-base font-semibold mb-3">¿Enviar consulta?</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleQuerySMS('query-signal')}>Sí</Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmingQuery(null)}>No</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleShare} variant="outline" className="w-full" size="lg">
        <Share2 className="w-5 h-5 mr-2" />
        Compartir por WhatsApp
      </Button>
    </div>
  )

  // Render Contacts Form
  const renderContactsForm = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Contactos de Emergencia</h2>
          <p className="text-base text-muted-foreground">Agregue hasta 5 números de teléfono</p>
        </div>

        <Accordion type="single" collapsible className="border-2 border-border rounded-lg">
          {config.contacts.map((contact, index) => (
            <AccordionItem key={index} value={`contact-${index}`} className="border-b border-border last:border-0">
              <AccordionTrigger className="text-base font-semibold hover:bg-muted">
                Contacto {index + 1}
                {contact.number && <Badge variant="secondary" className="ml-2">{contact.number}</Badge>}
              </AccordionTrigger>
              <AccordionContent>
                <ContactInput
                  value={contact}
                  onChange={(updated) => updateContact(index, updated)}
                  contactNumber={index + 1}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView('menu')} variant="outline" className="flex-1" size="lg">
            ← Volver al Menú
          </Button>
          <Button
            onClick={() => config.contacts[0]?.number && handleSendSMS('contact-1', config.contacts[0])}
            className="flex-1"
            size="lg"
            disabled={!config.contacts[0]?.number}
          >
            Enviar Mensaje SMS →
          </Button>
        </div>
      </div>
    )
  }

  // Render Battery Form
  const renderBatteryForm = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Alerta de Batería Baja</h2>
          <p className="text-base text-muted-foreground">Configure una alerta cuando la batería baje de cierto porcentaje</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Habilitar alerta de batería baja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Switch
                checked={config.batteryLow.enabled}
                onCheckedChange={(checked) =>
                  updateBatteryLow({ ...config.batteryLow, enabled: checked })
                }
              />
            </div>

            {config.batteryLow.enabled && (
              <div className="space-y-2">
                <Label className="text-base">Alertar cuando baje de:</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    min={5}
                    max={100}
                    step={5}
                    value={config.batteryLow.percentage}
                    onChange={(value) =>
                      updateBatteryLow({ ...config.batteryLow, percentage: value })
                    }
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-primary w-16">{config.batteryLow.percentage}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView('menu')} variant="outline" className="flex-1" size="lg">
            ← Volver al Menú
          </Button>
          <Button onClick={() => handleSendSMS('battery-low', config.batteryLow)} className="flex-1" size="lg">
            Enviar Mensaje SMS →
          </Button>
        </div>
      </div>
    )
  }

  // Render Fall Alert Form
  const renderFallForm = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Alerta de Caída</h2>
          <p className="text-base text-muted-foreground">Detecta cuando el dispositivo se cae</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Habilitar detección de caída</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Switch
                checked={config.fallAlert.enabled}
                onCheckedChange={(checked) =>
                  updateFallAlert({ ...config.fallAlert, enabled: checked })
                }
              />
            </div>

            {config.fallAlert.enabled && (
              <>
                <div className="space-y-3">
                  <Label className="text-base">Sensibilidad de detección:</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Baja</span>
                    <Slider
                      min={1}
                      max={10}
                      value={config.fallAlert.sensitivity}
                      onChange={(value) =>
                        updateFallAlert({ ...config.fallAlert, sensitivity: value })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Alta</span>
                  </div>
                  <p className="text-base font-bold text-primary text-center">{config.fallAlert.sensitivity}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <Label className="text-base">☑ Permitir llamadas automáticas</Label>
                  <Switch
                    checked={config.fallAlert.allowCall}
                    onCheckedChange={(checked) =>
                      updateFallAlert({ ...config.fallAlert, allowCall: checked })
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView('menu')} variant="outline" className="flex-1" size="lg">
            ← Volver al Menú
          </Button>
          <Button onClick={() => handleSendSMS('fall-alert', config.fallAlert)} className="flex-1" size="lg">
            Enviar Mensaje SMS →
          </Button>
        </div>
      </div>
    )
  }

  // Render Speed Alert Form
  const renderSpeedForm = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Alerta de Velocidad Máxima</h2>
          <p className="text-base text-muted-foreground">Alerta si el dispositivo supera esta velocidad</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Habilitar alerta de velocidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Switch
                checked={config.speedAlert.enabled}
                onCheckedChange={(checked) =>
                  updateSpeedAlert({ ...config.speedAlert, enabled: checked })
                }
              />
            </div>

            {config.speedAlert.enabled && (
              <div className="space-y-2">
                <Label className="text-base">Velocidad máxima permitida:</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="tel"
                    inputMode="numeric"
                    min="20"
                    max="400"
                    value={config.speedAlert.limit}
                    onChange={(e) => {
                      const value = Math.min(400, Math.max(20, Number(e.target.value)))
                      updateSpeedAlert({ ...config.speedAlert, limit: value })
                    }}
                    className="w-24 text-center"
                  />
                  <span className="text-lg font-semibold">km/h</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentView('menu')} variant="outline" className="flex-1" size="lg">
            ← Volver al Menú
          </Button>
          <Button onClick={() => handleSendSMS('speed-alert', config.speedAlert)} className="flex-1" size="lg">
            Enviar Mensaje SMS →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}

      <main className="pt-24 pb-8 px-6 max-w-2xl mx-auto">
        {currentView === 'menu' && renderMenu()}
        {currentView === 'contacts' && renderContactsForm()}
        {currentView === 'battery' && renderBatteryForm()}
        {currentView === 'fall' && renderFallForm()}
        {currentView === 'speed' && renderSpeedForm()}
      </main>
    </div>
  )
}

export default App
