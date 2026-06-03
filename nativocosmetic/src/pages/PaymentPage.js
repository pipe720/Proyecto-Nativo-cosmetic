import { useMemo, useState } from "react";
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
import { paymentProviders, testCards } from "../data/paymentProviders.js";
import "../styles.css";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-CL")} CLP`;
const onlyDigits = (value) => value.replace(/\D/g, "");

function isValidCardNumber(value) {
  const digits = onlyDigits(value);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
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

function getInitialOrder() {
  try {
    return JSON.parse(localStorage.getItem("nativoCheckout")) || null;
  } catch {
    return null;
  }
}

function PaymentPage() {
  const [order] = useState(getInitialOrder);
  const [providerId, setProviderId] = useState("webpay");
  const [environment, setEnvironment] = useState("sandbox");
  const [paymentType, setPaymentType] = useState("debito");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const provider = paymentProviders.find((item) => item.id === providerId);

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!provider || !provider.configured) {
      nextErrors.provider = "No existe un PSP configurado para procesar el pago.";
    }

    if (!order || !order.items?.length) {
      nextErrors.order = "No hay productos en el carrito para pagar.";
    }

    if (!paymentType) {
      nextErrors.paymentType = "Selecciona débito o crédito.";
    }

    if (form.cardName.trim().length < 3) {
      nextErrors.cardName = "Ingresa el nombre como aparece en la tarjeta.";
    }

    if (!isValidCardNumber(form.cardNumber)) {
      nextErrors.cardNumber = "Ingresa un número de tarjeta válido.";
    }

    if (!isValidExpiry(form.expiry)) {
      nextErrors.expiry = "Usa el formato MM/AA y una fecha vigente.";
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      nextErrors.cvv = "El CVV debe tener 3 o 4 dígitos.";
    }

    return nextErrors;
  }, [form, order, paymentType, provider]);

  const isFormValid = Object.keys(errors).length === 0;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
      setTransaction(null);
    }
  };

  const processPayment = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      setStatus("rejected");
      setMessage("Revisa los datos antes de enviar el pago.");
      return;
    }

    setStatus("processing");
    setMessage(`Redirigiendo de forma segura a ${provider.name} (${environment}).`);

    window.setTimeout(() => {
      const lastDigits = onlyDigits(form.cardNumber).slice(-4);

      if (lastDigits === "9999") {
        setStatus("connection-error");
        setMessage("No fue posible conectar con el PSP. Puedes reintentar la transacción.");
        return;
      }

      if (lastDigits === "0000") {
        setStatus("rejected");
        setMessage("Pago rechazado por el PSP. Intenta con otra tarjeta o método de pago.");
        return;
      }

      const approvedTransaction = {
        id: `TRX-${Date.now()}`,
        authCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        provider: provider.name,
        environment,
        paymentType,
        orderId: order.id,
        total: order.total,
        approvedAt: new Date().toISOString(),
      };

      localStorage.setItem("nativoLastTransaction", JSON.stringify(approvedTransaction));
      setTransaction(approvedTransaction);
      setStatus("approved");
      setMessage("Pago aprobado. La transacción fue registrada correctamente.");
    }, 1600);
  };

  return (
    <main className="payment-page">
      <section className="payment-hero">
        <Link className="text-link" to="/">
          <ArrowLeft aria-hidden="true" />
          Volver a la tienda
        </Link>
        <div>
          <p className="eyebrow">Pago seguro</p>
          <h1>Finaliza tu compra</h1>
          <p>Selecciona un medio de pago y completa tus datos de forma segura.</p>
        </div>
        <div className="secure-badges" aria-label="Seguridad del pago">
          <span>
            <LockKeyhole aria-hidden="true" />
            HTTPS seguro
          </span>
          <span>
            <ShieldCheck aria-hidden="true" />
            Datos sensibles no almacenados
          </span>
        </div>
      </section>

      <section className="payment-layout">
        <form className="payment-form" onSubmit={processPayment}>
          <div className="payment-block">
            <div className="payment-block-heading">
              <CreditCard aria-hidden="true" />
              <div>
                <h2>Medio de pago</h2>
                <p>Elige tarjeta de débito o crédito.</p>
              </div>
            </div>

            <div className="segmented-control" role="radiogroup" aria-label="Tipo de tarjeta">
              <button className={paymentType === "debito" ? "active" : ""} type="button" onClick={() => setPaymentType("debito")}>
                Débito
              </button>
              <button className={paymentType === "credito" ? "active" : ""} type="button" onClick={() => setPaymentType("credito")}>
                Crédito
              </button>
            </div>
          </div>

          <div className="payment-block">
            <div className="field-grid">
              <label>
                PSP configurado
                <select value={providerId} onChange={(event) => setProviderId(event.target.value)}>
                  {paymentProviders.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Ambiente
                <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Producción</option>
                </select>
              </label>
            </div>
            <p className="provider-note">Conexión segura: {environment === "sandbox" ? provider?.sandboxUrl : provider?.productionUrl}</p>
          </div>

          <div className="payment-block">
            <div className="field-grid">
              <label>
                Nombre en la tarjeta
                <input
                  autoComplete="cc-name"
                  value={form.cardName}
                  onChange={(event) => updateField("cardName", event.target.value)}
                  placeholder="Nombre Apellido"
                />
                {errors.cardName && <small>{errors.cardName}</small>}
              </label>

              <label>
                Número de tarjeta
                <input
                  autoComplete="cc-number"
                  inputMode="numeric"
                  maxLength="23"
                  value={form.cardNumber}
                  onChange={(event) => updateField("cardNumber", event.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
                {errors.cardNumber && <small>{errors.cardNumber}</small>}
              </label>

              <label>
                Vencimiento
                <input
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  maxLength="5"
                  value={form.expiry}
                  onChange={(event) => updateField("expiry", event.target.value)}
                  placeholder="MM/AA"
                />
                {errors.expiry && <small>{errors.expiry}</small>}
              </label>

              <label>
                CVV
                <input
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength="4"
                  type="password"
                  value={form.cvv}
                  onChange={(event) => updateField("cvv", onlyDigits(event.target.value))}
                  placeholder="123"
                />
                {errors.cvv && <small>{errors.cvv}</small>}
              </label>
            </div>
          </div>

          <div className={`payment-status ${status}`}>
            {status === "approved" && <CheckCircle aria-hidden="true" />}
            {status === "rejected" && <XCircle aria-hidden="true" />}
            {status === "connection-error" && <AlertTriangle aria-hidden="true" />}
            {status === "processing" && <RefreshCw aria-hidden="true" />}
            <span>{message || "El pago se procesa en menos de 10 segundos en este prototipo."}</span>
          </div>

          {transaction && (
            <div className="transaction-card">
              <strong>Transacción aprobada</strong>
              <span>ID: {transaction.id}</span>
              <span>Autorización: {transaction.authCode}</span>
              <span>PSP: {transaction.provider}</span>
            </div>
          )}

          <button className="button primary full" disabled={status === "processing"} type="submit">
            {status === "processing" ? "Procesando pago..." : "Pagar ahora"}
          </button>
        </form>

        <aside className="order-summary">
          <p className="eyebrow">Resumen</p>
          <h2>Pedido</h2>
          {order?.items?.length ? (
            <>
              <div className="summary-items">
                {order.items.map((item) => (
                  <article key={item.id}>
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </article>
                ))}
              </div>
              <div className="summary-total">
                <span>Total a pagar</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </>
          ) : (
            <p>No hay pedido activo. Vuelve al carrito para iniciar un pago.</p>
          )}

          <div className="sandbox-help">
            <strong>Tarjetas de prueba</strong>
            {testCards.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PaymentPage;
