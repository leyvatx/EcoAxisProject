from rest_framework import generics, viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from apps.pagos.models import PagoSubscripcion
from apps.pagos.serializers import PagoSubscripcionSerializer
from apps.empresas.models import Empresa

# ViewSet para API REST completa
class PagoSubscripcionViewSet(viewsets.ModelViewSet):
    queryset = PagoSubscripcion.objects.none()
    serializer_class = PagoSubscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return PagoSubscripcion.objects.none()
        return PagoSubscripcion.objects.filter(empresa__usuario=self.request.user)

    def perform_create(self, serializer):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        serializer.save(empresa=empresa)

# ✅ Crear pago (solo por PayPal)
class PagoSubscripcionCreateView(generics.CreateAPIView):
    serializer_class = PagoSubscripcionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        serializer.save(empresa=empresa)

# 📃 Listar pagos de la empresa del usuario autenticado
class PagoSubscripcionListView(generics.ListAPIView):
    serializer_class = PagoSubscripcionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        return PagoSubscripcion.objects.filter(empresa=empresa)

# 🔍 Ver un pago específico (por UUID)
class PagoSubscripcionDetailView(generics.RetrieveAPIView):
    serializer_class = PagoSubscripcionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pago_uuid'

    def get_queryset(self):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        return PagoSubscripcion.objects.filter(empresa=empresa)

# ✏️ Editar pago (por UUID)
class PagoSubscripcionUpdateView(generics.UpdateAPIView):
    serializer_class = PagoSubscripcionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pago_uuid'

    def get_queryset(self):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        return PagoSubscripcion.objects.filter(empresa=empresa)

# ❌ Eliminar pago (por UUID)
class PagoSubscripcionDeleteView(generics.DestroyAPIView):
    serializer_class = PagoSubscripcionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pago_uuid'

    def get_queryset(self):
        empresa = Empresa.objects.filter(usuario=self.request.user).first()
        return PagoSubscripcion.objects.filter(empresa=empresa)
