import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { formatPrice } from "./data/products";

const providers = {
  webpay: {
    name: "Webpay",
    sandbox: "https://sandbox.webpay.cl",
    production: "https://webpay.cl",
  },
  mercadopago: {
    name: "Mercado Pago",
    sandbox: "https://sandbox.mercadopago.com",
    production: "https://www.mercadopago.cl",
  },
};

const initialForm = {
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function readOrder() {
  try {
    return JSON.parse(localStorage.getItem("nativoCheckout"));
  } catch {
    return null;
  }
}

function isValidCardNumber(value) {
  const digits = onlyDigits(value);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function isValidExpiry(value) {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  if (month < 1 || month > 12) return false;

  return new Date(year, month) > new Date();
}

function getStatusIcon(type) {
  if (type === "approved") return <CheckCircle />;
  if (type === "rejected") return <XCircle />;
  if (type === "connection-error") return <AlertTriangle />;
  if (type === "processing") return <RefreshCw />;
  return null;
}

function Pago() {
  const [order, setOrder] = useState(null);
  const [paymentType, setPaymentType] = useState("debito");
  const [providerId, setProviderId] = useState("webpay");
  const [environment, setEnvironment] = useState("sandbox");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "idle",
    message: "El pago se procesa en menos de 10 segundos en este prototipo.",
  });
  const [transaction, setTransaction] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setOrder(readOrder());
  }, []);

  const provider = providers[providerId];
  const providerNote = useMemo(() => `Conexion segura: ${provider[environment]}`, [provider, environment]);
  const canPay = Boolean(order?.items?.length) && !submitting && status.type !== "approved";

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors = {
      cardName:
        form.cardName.trim().length >= 3 ? "" : "Ingresa el nombre como aparece en la tarjeta.",
      cardNumber: isValidCardNumber(form.cardNumber) ? "" : "Ingresa un numero de tarjeta valido.",
      expiry: isValidExpiry(form.expiry) ? "" : "Usa el formato MM/AA y una fecha vigente.",
      cvv: /^\d{3,4}$/.test(form.cvv) ? "" : "El CVV debe tener 3 o 4 digitos.",
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  function registerApprovedTransaction() {
    const nextTransaction = {
      id: `TRX-${Date.now()}`,
      codigoAutorizacion: Math.random().toString(36).slice(2, 8).toUpperCase(),
      proveedor: provider.name,
      ambiente: environment,
      tipoPago: paymentType,
      pedido: order.id,
      total: order.total,
      estado: "aprobado",
      fecha: new Date().toISOString(),
    };

    const paidOrder = { ...order, estado: "pagado" };
    setOrder(paidOrder);
    setTransaction(nextTransaction);
    localStorage.setItem("nativoCheckout", JSON.stringify(paidOrder));
    localStorage.setItem("nativoLastTransaction", JSON.stringify(nextTransaction));
  }

  function submitPayment(event) {
    event.preventDefault();
    setTransaction(null);

    if (!validate() || !order?.items?.length) {
      setStatus({ type: "rejected", message: "Revisa los datos antes de enviar el pago." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "processing", message: `Conectando de forma segura con ${provider.name}...` });

    window.setTimeout(() => {
      const cardNumber = onlyDigits(form.cardNumber);

      if (cardNumber === "4000000000009995") {
        setSubmitting(false);
        setStatus({
          type: "connection-error",
          message: "No fue posible conectar con el PSP. Puedes reintentar.",
        });
        return;
      }

      if (cardNumber === "4000000000000002") {
        setSubmitting(false);
        setStatus({
          type: "rejected",
          message: "Pago rechazado por el PSP. Intenta con otra tarjeta o metodo.",
        });
        return;
      }

      registerApprovedTransaction();
      setSubmitting(false);
      setStatus({
        type: "approved",
        message: "Pago aprobado. La transaccion fue registrada correctamente.",
      });
    }, 1600);
  }

  return (
    <main className="payment-page">
      <section className="payment-hero">
        <Link className="text-link" to="/">
          <ArrowLeft />
          Volver a la tienda
        </Link>
        <div>
          <p className="eyebrow">Pago seguro</p>
          <h1>Finaliza tu compra</h1>
          <p>Selecciona un medio de pago y completa tus datos de forma segura.</p>
        </div>
        <div className="secure-badges" aria-label="Seguridad del pago">
          <span>
            <LockKeyhole /> Conexion HTTPS segura
          </span>
          <span>
            <ShieldCheck /> No almacenamos datos de tarjeta
          </span>
        </div>
      </section>

      <section className="payment-layout">
        <form className="payment-form" onSubmit={submitPayment} noValidate>
          <div className="payment-block">
            <div className="payment-block-heading">
              <CreditCard />
              <div>
                <h2>Medio de pago</h2>
                <p>Elige tarjeta de debito o credito.</p>
              </div>
            </div>
            <div className="segmented-control" role="radiogroup" aria-label="Tipo de tarjeta">
              <button
                className={paymentType === "debito" ? "active" : ""}
                type="button"
                onClick={() => setPaymentType("debito")}
              >
                Debito
              </button>
              <button
                className={paymentType === "credito" ? "active" : ""}
                type="button"
                onClick={() => setPaymentType("credito")}
              >
                Credito
              </button>
            </div>
          </div>

          <div className="payment-block">
            <div className="field-grid">
              <label>
                PSP configurado
                <select value={providerId} onChange={(event) => setProviderId(event.target.value)}>
                  <option value="webpay">Webpay</option>
                  <option value="mercadopago">Mercado Pago</option>
                </select>
              </label>
              <label>
                Ambiente
                <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Produccion</option>
                </select>
              </label>
            </div>
            <p className="provider-note">{providerNote}</p>
          </div>

          <div className="payment-block">
            <div className="field-grid">
              <label>
                Nombre en la tarjeta
                <input
                  autoComplete="cc-name"
                  name="cardName"
                  placeholder="Nombre Apellido"
                  value={form.cardName}
                  onChange={updateField}
                />
                <small>{errors.cardName}</small>
              </label>
              <label>
                Numero de tarjeta
                <input
                  autoComplete="cc-number"
                  inputMode="numeric"
                  maxLength="23"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={form.cardNumber}
                  onChange={updateField}
                />
                <small>{errors.cardNumber}</small>
              </label>
              <label>
                Vencimiento
                <input
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  maxLength="5"
                  name="expiry"
                  placeholder="MM/AA"
                  value={form.expiry}
                  onChange={updateField}
                />
                <small>{errors.expiry}</small>
              </label>
              <label>
                CVV
                <input
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength="4"
                  name="cvv"
                  placeholder="123"
                  type="password"
                  value={form.cvv}
                  onChange={updateField}
                />
                <small>{errors.cvv}</small>
              </label>
            </div>
          </div>

          <div className={`payment-status ${status.type}`}>
            {getStatusIcon(status.type)}
            <span>{status.message}</span>
          </div>

          {transaction && (
            <div className="transaction-card">
              <strong>Transaccion aprobada</strong>
              <span>ID: {transaction.id}</span>
              <span>Autorizacion: {transaction.codigoAutorizacion}</span>
              <span>PSP: {transaction.proveedor}</span>
            </div>
          )}

          <button className="button primary full payment-submit" type="submit" disabled={!canPay}>
            <LockKeyhole />
            {status.type === "approved" ? "Pago completado" : "Pagar ahora"}
          </button>
        </form>

        <aside className="order-summary">
          <p className="eyebrow">Resumen</p>
          <h2>Pedido</h2>
          <div className="summary-items">
            {order?.items?.length ? (
              order.items.map((item) => (
                <article key={item.id}>
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </article>
              ))
            ) : (
              <p>No hay un pedido activo. Vuelve a la tienda y agrega productos al carrito.</p>
            )}
          </div>
          <div className="summary-total">
            <span>Total a pagar</span>
            <strong>{formatPrice(order?.total || 0).replace("Servicio", "$0 CLP")}</strong>
          </div>
          <div className="sandbox-help">
            <strong>Tarjetas de prueba</strong>
            <span>Aprobado: 4242 4242 4242 4242.</span>
            <span>Rechazado: 4000 0000 0000 0002.</span>
            <span>Error de conexion: 4000 0000 0000 9995.</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Pago;
