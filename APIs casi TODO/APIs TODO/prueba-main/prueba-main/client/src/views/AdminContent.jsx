import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { API_BASE, apiUrl } from "../lib/api";
import {
  fetchBanners,
  fetchPromos,
  fetchWelcomeText,
  fetchBrands,
  fetchPaymentMethods,
  fetchShippingMethods,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  createPromo,
  updatePromo,
  deletePromo,
  createWelcomeText,
  updateWelcomeText,
  deleteWelcomeText,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  uploadPaymentMethodImage,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  uploadShippingMethodImage,
} from "../redux/contentSlice";

const API = apiUrl("/api/content");

function getRoleFromToken(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userType || payload.role || null;
  } catch {
    return null;
  }
}

export default function AdminContent() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { 
    banners, 
    promos, 
    welcomeText, 
    brands, 
    paymentMethods, 
    shippingMethods,
    loading 
  } = useSelector((state) => state.content);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: '', id: null });
  const dragIndex = useRef(null);

  useEffect(() => {
    const role = getRoleFromToken(token);
    setIsAdmin(role === "ADMIN");
    
  
  }, [token]); 


  const handleCreateBanner = async () => {
    try {

      const bannerData = {
        title: "",
        subtitle: "",
        active: true,
        sortOrder: 0
      };
      const result = await dispatch(createBanner({ bannerData, token })).unwrap();
      toast.success("Banner creado ✅");
      return result;
    } catch (err) {
      toast.error("Error al crear el banner: " + (err?.message || err));
      return null;
    }
  };

  const handleUploadBannerImage = async (id, file, inputElement) => {
    if (!file) return;
    try {
      const result = await dispatch(uploadBannerImage({ id, file, token })).unwrap();
      toast.success("Imagen subida ✅");
      
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (err) {
      toast.error("Error al subir imagen: " + (err?.message || err));
      
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };

  const handleToggleBannerActive = async (b) => {
    try {
      const updated = { ...b, active: !b.active };
      await dispatch(updateBanner({ id: b.id, bannerData: updated, token })).unwrap();
      toast.success("Banner actualizado");
    } catch (err) {
      toast.error("Error actualizando banner");
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await dispatch(deleteBanner({ id, token })).unwrap();
      toast.success("Banner eliminado");
    } catch (err) {
      toast.error("Error eliminando banner");
    }
  };


  const handleCreatePromo = async (promoData) => {
    try {
      await dispatch(createPromo({ promoData, token })).unwrap();
      toast.success("Promo creada");
    } catch (err) {
      toast.error("Error creando promo");
    }
  };

  const handleUpdatePromo = async (p) => {
    try {
      await dispatch(updatePromo({ id: p.id, promoData: p, token })).unwrap();
      toast.success("Promo actualizada");
    } catch (err) {
      toast.error("Error actualizando promo");
    }
  };

  const handleDeletePromo = async (id) => {
    try {
      await dispatch(deletePromo({ id, token })).unwrap();
      toast.success("Promo eliminada");
    } catch (err) {
      toast.error("Error eliminando promo");
    }
  };

  const handleCreateWelcomeText = async (content) => {
    try {
      await dispatch(createWelcomeText({ textData: { content, active: true }, token })).unwrap();
      toast.success("Texto de bienvenida creado");
    } catch (err) {
      toast.error("Error creando texto");
    }
  };

  const handleUpdateWelcomeText = async (id, content) => {
    try {
      await dispatch(updateWelcomeText({ id, textData: { content }, token })).unwrap();
      toast.success("Texto actualizado");
    } catch (err) {
      toast.error("Error actualizando texto");
    }
  };

  const handleDeleteWelcomeText = async (id) => {
    try {
      await dispatch(deleteWelcomeText({ id, token })).unwrap();
      toast.success("Texto eliminado");
    } catch (err) {
      toast.error("Error eliminando texto");
    }
  };


  const handleCreateBrand = async (brandData) => {
    try {
      await dispatch(createBrand({ brandData, token })).unwrap();
      toast.success("Marca creada");
    } catch (err) {
      toast.error("Error creando marca");
    }
  };

  const handleUpdateBrand = async (id, brandData) => {
    try {
      await dispatch(updateBrand({ id, brandData, token })).unwrap();
      toast.success("Marca actualizada");
    } catch (err) {
      toast.error("Error actualizando marca");
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await dispatch(deleteBrand({ id, token })).unwrap();
      toast.success("Marca eliminada");
    } catch (err) {
      toast.error("Error eliminando marca");
    }
  };

  const handleUploadBrandImage = async (brandId, file, inputElement) => {
    try {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        toast.error("Solo se permiten imágenes PNG o JPEG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      await dispatch(uploadBrandImage({ id: brandId, file, token })).unwrap();
      toast.success("Imagen de marca subida");
      
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (err) {
      toast.error("Error al subir imagen de marca");
      
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };


  const handleCreatePaymentMethod = async (methodData) => {
    try {
      await dispatch(createPaymentMethod({ methodData, token })).unwrap();
      toast.success("Método de pago creado");
    } catch (err) {
      toast.error("Error creando método de pago");
    }
  };

  const handleUpdatePaymentMethod = async (id, methodData) => {
    try {
      await dispatch(updatePaymentMethod({ id, methodData, token })).unwrap();
      toast.success("Método de pago actualizado");
    } catch (err) {
      toast.error("Error actualizando método de pago");
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    try {
      await dispatch(deletePaymentMethod({ id, token })).unwrap();
      toast.success("Método de pago eliminado");
    } catch (err) {
      toast.error("Error eliminando método de pago");
    }
  };

  const handleUploadPaymentMethodImage = async (paymentMethodId, file, inputElement) => {
    try {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        toast.error("Solo se permiten imágenes PNG o JPEG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      await dispatch(uploadPaymentMethodImage({ id: paymentMethodId, file, token })).unwrap();
      toast.success("Imagen de método de pago subida");
      
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (err) {
      toast.error("Error al subir imagen de método de pago");
      
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };


  const handleCreateShippingMethod = async (methodData) => {
    try {
      await dispatch(createShippingMethod({ methodData, token })).unwrap();
      toast.success("Método de envío creado");
    } catch (err) {
      toast.error("Error creando método de envío");
    }
  };

  const handleUpdateShippingMethod = async (id, methodData) => {
    try {
      await dispatch(updateShippingMethod({ id, methodData, token })).unwrap();
      toast.success("Método de envío actualizado");
    } catch (err) {
      toast.error("Error actualizando método de envío");
    }
  };

  const handleDeleteShippingMethod = async (id) => {
    try {
      await dispatch(deleteShippingMethod({ id, token })).unwrap();
      toast.success("Método de envío eliminado");
    } catch (err) {
      toast.error("Error eliminando método de envío");
    }
  };

  const handleUploadShippingMethodImage = async (shippingMethodId, file, inputElement) => {
    try {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        toast.error("Solo se permiten imágenes PNG o JPEG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      await dispatch(uploadShippingMethodImage({ id: shippingMethodId, file, token })).unwrap();
      toast.success("Imagen de método de envío subida");
      
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (err) {
      toast.error("Error al subir imagen de método de envío");
      
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };

  function showConfirmDialog(type, id) {
    setConfirmDialog({ show: true, type, id });
  }

  function handleConfirmDelete() {
    if (confirmDialog.type === 'banner') {
      handleDeleteBanner(confirmDialog.id);
    } else if (confirmDialog.type === 'promo') {
      handleDeletePromo(confirmDialog.id);
    } else if (confirmDialog.type === 'welcomeText') {
      handleDeleteWelcomeText(confirmDialog.id);
    } else if (confirmDialog.type === 'brand') {
      handleDeleteBrand(confirmDialog.id);
    } else if (confirmDialog.type === 'paymentMethod') {
      handleDeletePaymentMethod(confirmDialog.id);
    } else if (confirmDialog.type === 'shippingMethod') {
      handleDeleteShippingMethod(confirmDialog.id);
    }
    setConfirmDialog({ show: false, type: '', id: null });
  }

  function handleCancelDelete() {
    setConfirmDialog({ show: false, type: '', id: null });
  }

  function onDragStart(e, idx) {
    dragIndex.current = idx;
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onDrop(e, idx) {
    e.preventDefault();
    const from = dragIndex.current;
    const to = idx;
    if (from == null || from === to) return;
    const copy = [...promos];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    copy.forEach((p, i) => (p.sortOrder = i));
    setPromos(copy);
    copy.forEach((p) => {
      dispatch(updatePromo({ id: p.id, promoData: p, token }))
        .unwrap()
        .catch((err) => console.error("Error persisting promo order", err));
    });
    dragIndex.current = null;
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Acceso denegado 🚫</h2>
        <p>Solo los administradores pueden gestionar contenido.</p>
      </main>
    );
  }

  return (
    <main style={S.page}>
      <h1 style={S.title}>Gestión de Contenido 🖼️</h1>

      <section style={S.tableWrap}>
        <h3>Banners</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(banners || []).map((b) => (
            <div key={b.id} style={{ border: "1px solid #ddd", padding: 12, width: 240, background: "#fff" }}>
              <div style={{ minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f3f3" }}>
                <img
                  alt={`banner-${b.id}`}
                  src={`${API}/banners/${b.id}/image?${Date.now()}`}
                  style={{ maxWidth: "100%", maxHeight: 140, objectFit: "cover" }}
                  onError={(e) => (e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath fill='%23ddd' d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E")}
                />
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <label htmlFor={`banner-upload-${b.id}`} style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                  Subir imagen del banner
                </label>
                <input 
                  id={`banner-upload-${b.id}`}
                  type="file" 
                  accept="image/png,image/jpeg,image/jpg" 
                  onChange={(e) => handleUploadBannerImage(b.id, e.target.files[0], e.target)} 
                  style={{ fontSize: '12px' }}
                />
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={() => handleToggleBannerActive(b)} style={S.editBtn}>{b.active ? "Desactivar" : "Activar"}</button>
                <button onClick={() => showConfirmDialog('banner', b.id)} style={S.delBtn}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const file = e.target.bannerImage.files[0];
            if (!file) {
              toast.error("Por favor seleccione una imagen");
              return;
            }
            
            
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
              toast.error("Solo se permiten imágenes PNG o JPEG");
              return;
            }
              
            const maxSize = 5 * 1024 * 1024; 
            if (file.size > maxSize) {
              toast.error("La imagen no debe superar los 5MB");
              return;
            }
            
            const banner = await handleCreateBanner();
            if (!banner || !banner.id) {
              toast.error("Error al crear el banner");
              return;
            }

            await handleUploadBannerImage(banner.id, file);

            e.target.reset();
          }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label htmlFor="new-banner-image" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
              Imagen del nuevo banner
            </label>
            <input 
              id="new-banner-image"
              type="file" 
              name="bannerImage" 
              accept="image/png,image/jpeg,image/jpg" 
              required 
              style={{ flex: 1 }} 
            />
            <button type="submit" style={{ ...S.button, background: "#16a34a" }}>Crear banner</button>
          </form>
        </div>
      </section>

      <section style={{ ...S.tableWrap, marginTop: 20 }}>
        <h3>Promos </h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(promos || []).map((p, i) => (
            <li
              key={p.id}
              draggable
              onDragStart={(e) => onDragStart(e, i)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, i)}
              style={{
                padding: 12,
                marginBottom: 8,
                background: "#fff",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <span>{p.message}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => showConfirmDialog('promo', p.id)} style={S.delBtn}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 12 }}>
          <h4>Crear promo</h4>
          <PromoForm onSave={handleCreatePromo} />
        </div>
      </section>

  
      <section style={S.section}>
        <h2>📝 Textos de Bienvenida</h2>
  
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(welcomeText || []).map((text) => (
            <div key={text.id} style={{
              background: "#fff",
              border: "1px solid #b8dfb8",
              borderRadius: 8,
              padding: 12,
            }}>
              <textarea
                value={text.content}
                onChange={(e) => handleUpdateWelcomeText(text.id, e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 80,
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => showConfirmDialog('welcomeText', text.id)}
                style={{ ...S.delBtn, marginTop: 8 }}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Agregar nuevo texto</h4>
          <WelcomeTextForm onSave={handleCreateWelcomeText} />
        </div>
      </section>

     
      <section style={S.section}>
        <h2>🏷️ Marcas</h2>
      

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {(brands || []).map((brand) => (
            <div key={brand.id} style={{
              background: "#fff",
              border: "1px solid #b8dfb8",
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
            }}>
              {brand.imageUrl ? (
                <img
                  src={`${API}/brands/${brand.id}/image`}
                  alt={brand.name}
                  style={{ width: "100%", height: 120, objectFit: "contain", marginBottom: 8 }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  borderRadius: 4,
                  marginBottom: 8,
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  Sin imagen
                </div>
              )}
              <h4 style={{ margin: "8px 0" }}>{brand.name}</h4>
              {brand.link && (
                <a href={brand.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "#16a34a" }}>
                  {brand.link}
                </a>
              )}
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexDirection: "column" }}>
                <label htmlFor={`brand-upload-${brand.id}`} style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                  Subir logo de la marca
                </label>
                <input
                  id={`brand-upload-${brand.id}`}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files[0]) handleUploadBrandImage(brand.id, e.target.files[0], e.target);
                  }}
                  style={{ fontSize: "0.85rem" }}
                />
                <button
                  onClick={() => showConfirmDialog('brand', brand.id)}
                  style={S.delBtn}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Crear nueva marca</h4>
          <BrandForm onSave={handleCreateBrand} />
        </div>
      </section>

 
      <section style={S.section}>
        <h2>💳 Métodos de Pago</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {(paymentMethods || []).map((method) => (
            <div key={method.id} style={{
              background: "#fff",
              border: "1px solid #b8dfb8",
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
            }}>
              {method.imageUrl ? (
                <img
                  src={`${API}/payment-methods/${method.id}/image`}
                  alt={method.name}
                  style={{ width: "100%", height: 80, objectFit: "contain", marginBottom: 8 }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  borderRadius: 4,
                  marginBottom: 8,
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  Sin imagen
                </div>
              )}
              <h4 style={{ margin: "8px 0", fontSize: "0.9rem" }}>{method.name}</h4>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexDirection: "column" }}>
                <label htmlFor={`payment-method-upload-${method.id}`} style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                  Subir logo del método de pago
                </label>
                <input
                  id={`payment-method-upload-${method.id}`}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files[0]) handleUploadPaymentMethodImage(method.id, e.target.files[0], e.target);
                  }}
                  style={{ fontSize: "0.85rem" }}
                />
                <button
                  onClick={() => showConfirmDialog('paymentMethod', method.id)}
                  style={S.delBtn}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Agregar método de pago</h4>
          <SimpleForm onSave={handleCreatePaymentMethod} placeholder="Nombre del método (ej: Visa, Mastercard)" />
        </div>
      </section>


      <section style={S.section}>
        <h2>🚚 Métodos de Envío</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {(shippingMethods || []).map((method) => (
            <div key={method.id} style={{
              background: "#fff",
              border: "1px solid #b8dfb8",
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
            }}>
              {method.imageUrl ? (
                <img
                  src={`${API}/shipping-methods/${method.id}/image`}
                  alt={method.name}
                  style={{ width: "100%", height: 80, objectFit: "contain", marginBottom: 8 }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  borderRadius: 4,
                  marginBottom: 8,
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  Sin imagen
                </div>
              )}
              <h4 style={{ margin: "8px 0", fontSize: "0.9rem" }}>{method.name}</h4>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexDirection: "column" }}>
                <label htmlFor={`shipping-method-upload-${method.id}`} style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                  Subir logo del método de envío
                </label>
                <input
                  id={`shipping-method-upload-${method.id}`}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files[0]) handleUploadShippingMethodImage(method.id, e.target.files[0], e.target);
                  }}
                  style={{ fontSize: "0.85rem" }}
                />
                <button
                  onClick={() => showConfirmDialog('shippingMethod', method.id)}
                  style={S.delBtn}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Agregar método de envío</h4>
          <SimpleForm onSave={handleCreateShippingMethod} placeholder="Nombre del método (ej: Correo Argentino, Andreani)" />
        </div>
      </section>


      {confirmDialog.show && (
        <div style={S.modalOverlay}>
          <div style={S.modalContent}>
            <h3 style={S.modalTitle}>Confirmar eliminación</h3>
            <p style={S.modalMessage}>
              ¿Estás seguro de que deseas eliminar este {
                confirmDialog.type === 'banner' ? 'banner' : 
                confirmDialog.type === 'promo' ? 'promo' :
                confirmDialog.type === 'welcomeText' ? 'texto' :
                confirmDialog.type === 'brand' ? 'marca' :
                confirmDialog.type === 'paymentMethod' ? 'método de pago' :
                confirmDialog.type === 'shippingMethod' ? 'método de envío' :
                'elemento'
              }?
            </p>
            <div style={S.modalButtons}>
              <button onClick={handleCancelDelete} style={S.cancelBtn}>Cancelar</button>
              <button onClick={handleConfirmDelete} style={S.confirmBtn}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PromoForm({ onSave }) {
  const [message, setMessage] = useState("");
  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
      <label htmlFor="promo-message" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
        Mensaje
      </label>
      <input 
        id="promo-message"
        placeholder="Mensaje" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={() => { 
        if (message.trim()) { 
          onSave({ message, active: true }); 
          setMessage(""); 
        } 
      }}>
        Crear promo
      </button>
    </div>
  );
}

function WelcomeTextForm({ onSave }) {
  const [content, setContent] = useState("");
  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 600 }}>
      <label htmlFor="welcome-text-content" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
        Texto de bienvenida
      </label>
      <textarea
        id="welcome-text-content"
        placeholder="Escribe el texto de bienvenida aquí..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ minHeight: 80, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button onClick={() => { if (content.trim()) { onSave(content); setContent(""); } }}>
        Agregar texto
      </button>
    </div>
  );
}

function BrandForm({ onSave }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  
  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name, link: link || null, sortOrder: 0, active: true });
    setName("");
    setLink("");
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
      <label htmlFor="brand-name" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
        Nombre de la marca
      </label>
      <input
        id="brand-name"
        placeholder="Nombre de la marca"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="brand-link" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
        Link (opcional)
      </label>
      <input
        id="brand-link"
        placeholder="Link (opcional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleSubmit}>Crear marca</button>
      <small style={{ color: "#666" }}>
        Nota: Después de crear la marca, podrás subir su imagen
      </small>
    </div>
  );
}

function SimpleForm({ onSave, placeholder }) {
  const [name, setName] = useState("");
  
  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name, sortOrder: 0, active: true });
    setName("");
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
      <label htmlFor="simple-form-name" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
        Nombre
      </label>
      <input
        id="simple-form-name"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Agregar</button>
      <small style={{ color: "#666" }}>
        Nota: Después de crear, podrás subir su imagen
      </small>
    </div>
  );
}

const S = {
  page: {
    background: "#d1f5d1",
    minHeight: "0vh",
    padding: "40px 0 80px",
  },
  title: { textAlign: "center", fontSize: "2rem", marginBottom: 30 },
  form: {
    display: "grid",
    gap: 12,
    maxWidth: 600,
    margin: "0 auto 40px",
    background: "#e9ffe9",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #b8dfb8",
    outline: "none",
    fontSize: 15,
  },
  button: {
    border: "none",
    borderRadius: 10,
    color: "#fff",
    padding: "12px 14px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
  },
  tableWrap: {
    maxWidth: 1000,
    margin: "0 auto",
    background: "#e9ffe9",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: 8, borderBottom: "2px solid #16a34a", color: "#14532d" },
  td: { padding: 10, borderBottom: "1px solid #b8dfb8" },
  editBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 8px",
    marginRight: 4,
    cursor: "pointer",
  },
  delBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "24px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#14532d",
  },
  modalMessage: {
    fontSize: "1rem",
    color: "#333",
    marginBottom: "20px",
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
  },
  confirmBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
  },
};
