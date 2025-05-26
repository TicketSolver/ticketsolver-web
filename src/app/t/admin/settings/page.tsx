"use client"

import { useEffect, useState } from "react"
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Bot,
  Palette,
  Globe,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)

  // Estados para as configurações
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "TicketSolver",
    systemDescription: "Sistema de Gerenciamento de Chamados de TI",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    autoAssignTickets: true,
    allowUserRegistration: false,
    maintenanceMode: false
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyNewTicket: true,
    notifyTicketUpdate: true,
    notifyTicketResolved: true,
    notifyOverdue: true
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "sistema@empresa.com",
    smtpPassword: "••••••••",
    senderName: "TicketSolver",
    senderEmail: "noreply@empresa.com",
    enableTLS: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "60",
    passwordMinLength: "8",
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    enableTwoFactor: false,
    maxLoginAttempts: "5",
    lockoutDuration: "15"
  })

  const [aiSettings, setAiSettings] = useState({
    enableAI: true,
    aiProvider: "openai",
    apiKey: "sk-••••••••••••••••••••••••••••••••",
    model: "gpt-4",
    maxTokens: "1000",
    temperature: "0.7",
    autoResolveThreshold: "0.8",
    enableLearning: true
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleSaveSettings = (section: string) => {
    console.log(`Salvando configurações da seção: ${section}`)
  }

  return (
    <DashboardShell userRole="admin" userName="Administrador">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as configurações globais do TicketSolver
          </p>
        </div>
        <Button onClick={() => handleSaveSettings('all')}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Todas
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="ai">IA/Assistente</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>Configurações Gerais</CardTitle>
              </div>
              <CardDescription>
                Configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input
                    id="systemName"
                    value={generalSettings.systemName}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      systemName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) =>
                    setGeneralSettings({...generalSettings, timezone: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemDescription">Descrição do Sistema</Label>
                <Textarea
                  id="systemDescription"
                  value={generalSettings.systemDescription}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    systemDescription: e.target.value
                  })}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Configurações de Operação</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atribuição Automática de Chamados</Label>
                    <p className="text-sm text-muted-foreground">
                      Atribui automaticamente chamados para técnicos disponíveis
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.autoAssignTickets}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      autoAssignTickets: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Auto-Registro de Usuários</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que novos usuários se registrem no sistema
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.allowUserRegistration}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      allowUserRegistration: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-red-600">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Bloqueia acesso ao sistema para manutenção
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      maintenanceMode: checked
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('general')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações Gerais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Configurações de Notificações</CardTitle>
              </div>
              <CardDescription>
                Configure como e quando as notificações são enviadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Tipos de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Notificações em tempo real no navegador</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Eventos de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <Label>Novo Chamado Criado</Label>
                  <Switch
                    checked={notificationSettings.notifyNewTicket}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      notifyNewTicket: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Chamado Atualizado</Label>
                  <Switch
                    checked={notificationSettings.notifyTicketUpdate}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      notifyTicketUpdate: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Chamado Resolvido</Label>
                  <Switch
                    checked={notificationSettings.notifyTicketResolved}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      notifyTicketResolved: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Chamados Atrasados</Label>
                  <Switch
                    checked={notificationSettings.notifyOverdue}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      notifyOverdue: checked
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('notifications')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Notificações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <CardTitle>Configurações de Email</CardTitle>
              </div>
              <CardDescription>
                Configure o servidor SMTP para envio de emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpHost: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpPort: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuário</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpUser: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showSmtpPassword ? "text" : "password"}
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({
                        ...emailSettings,
                        smtpPassword: e.target.value
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    >
                      {showSmtpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Nome do Remetente</Label>
                  <Input
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      senderName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Email do Remetente</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      senderEmail: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Habilitar TLS/SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Usar conexão segura para envio de emails
                  </p>
                </div>
                <Switch
                  checked={emailSettings.enableTLS}
                  onCheckedChange={(checked) => setEmailSettings({
                    ...emailSettings,
                    enableTLS: checked
                  })}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Testar Configuração
                </Button>
                <Button onClick={() => handleSaveSettings('email')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Configurações de Segurança</CardTitle>
              </div>
              <CardDescription>
                Configure políticas de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      passwordMinLength: e.target.value
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Política de Senhas</h4>
                
                <div className="flex items-center justify-between">
                  <Label>Exigir Letras Maiúsculas</Label>
                  <Switch
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      requireUppercase: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Exigir Números</Label>
                  <Switch
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      requireNumbers: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Exigir Caracteres Especiais</Label>
                  <Switch
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      requireSpecialChars: checked
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      maxLoginAttempts: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Duração do Bloqueio (minutos)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      lockoutDuration: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('security')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Segurança
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de IA */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle>Configurações da Assistente Virtual</CardTitle>
              </div>
              <CardDescription>
                Configure a assistente de IA para diagnóstico automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Habilitar Assistente Virtual</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativa o primeiro nível de atendimento automatizado
                  </p>
                </div>
                <Switch
                  checked={aiSettings.enableAI}
                  onCheckedChange={(checked) => setAiSettings({
                    ...aiSettings,
                    enableAI: checked
                  })}
                />
              </div>

              {aiSettings.enableAI && (
                <>
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiProvider">Provedor de IA</Label>
                      <Select value={aiSettings.aiProvider} onValueChange={(value) =>
                        setAiSettings({...aiSettings, aiProvider: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="azure">Azure OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Select value={aiSettings.model} onValueChange={(value) =>
                        setAiSettings({...aiSettings, model: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude-3">Claude 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">Chave da API</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        value={aiSettings.apiKey}
                        onChange={(e) => setAiSettings({
                          ...aiSettings,
                          apiKey: e.target.value
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        value={aiSettings.maxTokens}
                        onChange={(e) => setAiSettings({
                          ...aiSettings,
                          maxTokens: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperatura (0-1)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={aiSettings.temperature}
                        onChange={(e) => setAiSettings({
                          ...aiSettings,
                          temperature: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="autoResolveThreshold">Threshold Auto-Resolução</Label>
                      <Input
                        id="autoResolveThreshold"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={aiSettings.autoResolveThreshold}
                        onChange={(e) => setAiSettings({
                          ...aiSettings,
                          autoResolveThreshold: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Aprendizado Contínuo</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que a IA aprenda com interações passadas
                      </p>
                    </div>
                    <Switch
                      checked={aiSettings.enableLearning}
                      onCheckedChange={(checked) => setAiSettings({
                        ...aiSettings,
                        enableLearning: checked
                      })}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <Button variant="outline" disabled={!aiSettings.enableAI}>
                  <Bot className="h-4 w-4 mr-2" />
                  Testar Assistente
                </Button>
                <Button onClick={() => handleSaveSettings('ai')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar IA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Configurações do Sistema</CardTitle>
              </div>
              <CardDescription>
                Backup, logs e informações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Backup Automático</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequência do Backup</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Retenção (dias)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
              </div>

              <Separator />
                          
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Logs do Sistema</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nível de Log</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Retenção de Logs (dias)</Label>
                                        <Input type="number" defaultValue="7" />
                  </div>
                </div>
              </div>
              
              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Informações do Sistema</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Versão do Sistema</Label>
                    <Input value="1.0.0" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Última Atualização</Label>
                    <Input value="2025-05-26 02:36" disabled />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status do Banco de Dados</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Conectado</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Uso de Disco</Label>
                    <div className="text-sm">
                      <span>2.3 GB / 100 GB (2.3%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Ações do Sistema</h4>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Manual
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Limpar Cache
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Otimizar BD
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('system')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}