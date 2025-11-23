import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiUsers, FiAward, FiMapPin, FiGrid } from 'react-icons/fi';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const About = () => {
  const [sections, setSections] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [kabinetSasmita, setKabinetSasmita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/about'),
      api.get('/organization'),
      api.get('/kabinet-sasmita')
    ])
      .then(([aboutRes, orgRes, sasmitaRes]) => {
        if (aboutRes.data && aboutRes.data.success) {
          setSections(aboutRes.data.data || []);
        } else {
          setSections([]);
        }
        if (orgRes.data && orgRes.data.success) {
          setOrganization(orgRes.data.data || []);
        } else {
          setOrganization([]);
        }
        if (sasmitaRes.data && sasmitaRes.data.success) {
          setKabinetSasmita(sasmitaRes.data.data);
        } else {
          setKabinetSasmita(null);
        }
      })
      .catch((error) => {
        console.error('Error loading about page:', error);
        setSections([]);
        setOrganization([]);
        setKabinetSasmita(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  const history = sections.find(s => s.section_type === 'history');
  const vision = sections.find(s => s.section_type === 'vision');
  const mission = sections.find(s => s.section_type === 'mission');

  // Group organization: Prioritaskan division jika ada, jika tidak semua masuk ke grup "Jabatan"
  // Agar anggota baru tetap berada dalam grup yang sama, tidak membuat kotak baru
  const groupedOrg = organization.reduce((acc, member) => {
    // Jika anggota punya division yang spesifik, gunakan division
    // Jika tidak ada division, semua masuk ke grup "Jabatan" (satu grup)
    const key = member.division || 'Jabatan';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(member);
    return acc;
  }, {});
  
  // Sort members within each group by order_index untuk urutan yang konsisten
  Object.keys(groupedOrg).forEach(key => {
    groupedOrg[key].sort((a, b) => {
      // Sort by order_index jika ada, jika tidak urutkan by position
      if (a.order_index !== b.order_index) {
        return (a.order_index || 0) - (b.order_index || 0);
      }
      return (a.position || '').localeCompare(b.position || '');
    });
  });


  return (
    <div className="py-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 relative">
        {/* Header - Enhanced */}
        <div className="text-center mb-20">
          <div className="inline-block mb-8 relative group/logo">
            {/* Simple subtle glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-primary-500/10 rounded-full blur-2xl transform scale-150 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
            
            {/* Simple border frame */}
            <div className="absolute inset-0 rounded-full border border-gold/30 group-hover/logo:border-gold/50 transition-all duration-300"></div>
            
            {/* Logo image with simple hover effect */}
            <div className="relative flex items-center justify-center mx-auto transform group-hover/logo:scale-105 transition-transform duration-300">
              <img 
                src="/images/LOGO FSRD.PNG" 
                alt="Logo FSRD ISI Yogyakarta"
                className="relative h-48 w-auto object-contain drop-shadow-xl group-hover/logo:drop-shadow-2xl transition-all duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              
              {/* Fallback */}
              <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-lg hidden items-center justify-center shadow-lg">
                <span className="text-gray-100 font-bold text-3xl">ISI</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-2xl bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
            Institut Seni Indonesia Yogyakarta
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto mb-6"></div>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light backdrop-blur-sm bg-gray-800/30 px-6 py-4 rounded-2xl border border-gray-700/30 shadow-lg">
              Perguruan tinggi seni yang melestarikan dan mengembangkan seni tradisional serta kontemporer Indonesia
            </p>
          </div>
        </div>

        {/* Kabinet Sasmita */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-100 mb-4">
              Kabinet Sasmita
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto mb-8"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
              {/* Decorative corners */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
                {/* Image - Enhanced frame */}
                <div className="md:col-span-1 flex justify-center md:justify-start">
                  <div className="relative group/image">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold to-primary-600 rounded-2xl opacity-20 group-hover/image:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700 max-w-xs w-full transform group-hover/image:scale-105 transition-transform duration-500">
                      <img
                        src="/images/sasmita.png"
                        alt="Kabinet Sasmita BEM FSRD ISI Yogyakarta"
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          console.error('Error loading sasmita.png');
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description - On the right */}
                <div className="md:col-span-2">
                  <div className="prose max-w-none text-gray-300 leading-relaxed">
                    {kabinetSasmita ? (
                      <>
                        <p className="mb-4 text-xl font-semibold text-gray-100">
                          {kabinetSasmita.title || 'Mengenal Kabinet Sasmita'}
                        </p>
                        <div
                          className="text-base"
                          dangerouslySetInnerHTML={{ __html: kabinetSasmita.description }}
                        />
                      </>
                    ) : (
                      <>
                        <p className="mb-4 text-xl font-semibold text-gray-100">
                          Mengenal Kabinet Sasmita
                        </p>
                        <p className="mb-4 text-base">
                          Deskripsi Kabinet Sasmita akan ditampilkan di sini. Admin dapat mengatur deskripsi melalui admin panel.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        {history && (
          <section className="mb-16">
            <div className="card-gradient bg-gradient-to-br from-gray-800 via-gray-800/50 to-gray-800 p-8 md:p-12 border-gray-700/50">
              <h2 className="text-3xl font-display font-bold text-gray-100 mb-6">
                Sejarah
              </h2>
              {history.image && (
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={getImageUrl(history.image)}
                    alt={history.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <div
                className="prose max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: history.content }}
              />
            </div>
          </section>
        )}

        {/* Vision & Mission */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-100 mb-4">
              Visi & Misi BEM FSRD ISI Yogyakarta
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vision ? (
              <div className="card p-8 bg-gradient-to-br from-primary-800 to-primary-900 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gold rounded-lg shadow-lg">
                    <FiAward className="text-gray-100" size={28} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gold">Visi</h2>
                </div>
                <div
                  className="prose prose-invert max-w-none text-white text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: vision.content }}
                />
              </div>
            ) : (
              <div className="card p-8 bg-gradient-to-br from-primary-800 to-primary-900 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gold rounded-lg shadow-lg">
                    <FiAward className="text-gray-100" size={28} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gold">Visi</h2>
                </div>
                <p className="text-white text-lg leading-relaxed">
                  Visi BEM FSRD ISI Yogyakarta akan ditampilkan di sini.
                </p>
                <p className="text-sm text-gray-300 mt-4">Admin dapat mengatur visi melalui admin panel.</p>
              </div>
            )}

            {mission ? (
              <div className="card p-8 bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary-800 rounded-lg shadow-lg">
                    <FiUsers className="text-white" size={28} />
                  </div>
                  <h2 className="text-3xl font-display font-bold">Misi</h2>
                </div>
                <div
                  className="prose prose-invert max-w-none text-white text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mission.content }}
                />
              </div>
            ) : (
              <div className="card p-8 bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary-800 rounded-lg shadow-lg">
                    <FiUsers className="text-white" size={28} />
                  </div>
                  <h2 className="text-3xl font-display font-bold">Misi</h2>
                </div>
                <p className="text-white text-lg leading-relaxed">
                  Misi BEM FSRD ISI Yogyakarta akan ditampilkan di sini.
                </p>
                <p className="text-sm text-gray-200 mt-4">Admin dapat mengatur misi melalui admin panel.</p>
              </div>
            )}
          </div>
        </section>

        {/* Organization Structure */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-100 mb-4">
              Struktur Organisasi BEM FSRD ISI Yogyakarta
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
            <p className="text-gray-400 mt-4">Kepengurusan Badan Eksekutif Mahasiswa FSRD</p>
          </div>

          {organization.length === 0 ? (
            <div className="card p-12 text-center">
              <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-400">Struktur organisasi akan ditampilkan di sini.</p>
              <p className="text-sm text-gray-500 mt-2">Admin dapat menambahkan anggota melalui admin panel.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedOrg).map(([group, members], groupIndex) => {
                // STANDARISASI: Duplikasi 8x untuk semua grup - seamless infinite scroll
                const duplicatedMembers = [...members, ...members, ...members, ...members, ...members, ...members, ...members, ...members];
                // STANDARISASI: Arah scroll bergantian untuk semua grup
                // Group index genap (0, 2, 4...) = scroll ke kiri
                // Group index ganjil (1, 3, 5...) = scroll ke kanan
                const scrollLeft = groupIndex % 2 === 0;
                
                return (
                <div key={group} className="relative p-8 group/org-card rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gold/50 transition-all duration-500" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-primary-500/10 opacity-0 group-hover/org-card:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-full opacity-0 group-hover/org-card:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-tr-full opacity-0 group-hover/org-card:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    {/* Header dengan efek */}
                    <h3 className="text-2xl font-display font-bold text-gray-100 mb-6 pb-3 border-b-2 border-gold relative">
                      <span className="relative">{group}</span>
                      {/* Underline glow effect */}
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover/org-card:opacity-100 transition-opacity duration-500"></div>
                    </h3>
                    
                    {/* Scrolling Container - MEMPERTAHANKAN SCROLL HORIZONTAL */}
                    <div className="scroll-container overflow-hidden relative w-full">
                      {/* Gradient fade overlay di kiri dan kanan untuk efek fade */}
                      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a1628] to-transparent z-20 pointer-events-none"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a1628] to-transparent z-20 pointer-events-none"></div>
                      
                      <div 
                        className={`flex gap-6 ${scrollLeft ? 'animate-scroll-left' : 'animate-scroll-right'}`}
                        style={{ 
                          width: 'max-content',
                          animationDuration: '40s',
                          animationTimingFunction: 'linear',
                          animationIterationCount: 'infinite'
                        }}
                      >
                        {/* Card member dengan efek yang lebih menarik */}
                        {duplicatedMembers.map((member, index) => (
                          <div 
                            key={`${member.id}-${index}`} 
                            className="text-center flex-shrink-0 w-48 px-3 group/member"
                          >
                            {/* Card wrapper dengan efek hover */}
                            <div className="relative p-4 rounded-xl border border-gray-700/30 hover:border-gold/50 transition-all duration-300 group-hover/member:shadow-lg group-hover/member:shadow-gold/20" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                              {/* Photo container dengan bingkai - tanpa efek bergeser */}
                              <div className="relative inline-block mb-4">
                                {/* Container foto utama - border sederhana tanpa efek */}
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600 mx-auto">
                                  {member.photo ? (
                                    <img
                                      src={getImageUrl(member.photo)}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=1e3a8a&color=fff&size=128';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center">
                                      <span className="text-white font-bold text-2xl">
                                        {member.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Text info dengan efek */}
                              <h4 className="font-semibold text-base text-gray-100 mb-1 group-hover/member:text-gold transition-colors duration-300">{member.name}</h4>
                              <p className="text-sm text-gold font-medium mb-1">{member.position}</p>
                              {member.division && member.division !== member.position && (
                                <p className="text-xs text-gray-500 mb-1">{member.division}</p>
                              )}
                              {member.bio && (
                                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{member.bio}</p>
                              )}
                              
                              {/* Contact icons dengan efek */}
                              <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700/30">
                                {member.email && (
                                  <a
                                    href={`mailto:${member.email}`}
                                    className="text-gray-400 hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10"
                                    title={member.email}
                                  >
                                    <FiMail size={14} />
                                  </a>
                                )}
                                {member.phone && (
                                  <a
                                    href={`tel:${member.phone}`}
                                    className="text-gray-400 hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10"
                                    title={member.phone}
                                  >
                                    <FiPhone size={14} />
                                  </a>
                                )}
                              </div>
                              
                              {/* Hover glow effect pada card */}
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/0 via-transparent to-primary-500/0 opacity-0 group-hover/member:opacity-100 group-hover/member:from-gold/5 group-hover/member:to-primary-500/5 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Additional Info - Enhanced */}
        <section className="relative rounded-2xl p-8 md:p-12 overflow-hidden border border-gray-700/50" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-primary-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Divisi Card */}
            <div className="group relative rounded-2xl p-8 overflow-hidden border border-gray-700/50 hover:border-gold/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-gold/20" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              {/* Icon background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative flex justify-center mb-6">
                <div className="relative p-4 bg-gradient-to-br from-gold/20 to-primary-500/20 rounded-2xl group-hover:from-gold/30 group-hover:to-primary-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-primary-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FiGrid className="relative text-4xl text-gold z-10" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-gold transition-colors duration-300">Divisi</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-gold to-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-300 font-medium leading-relaxed">
                Humas, PSDM, Desain, PUPDOK, Kewirausahaan, BPH
              </p>
            </div>

            {/* Lokasi Card */}
            <div className="group relative rounded-2xl p-8 overflow-hidden border border-gray-700/50 hover:border-gold/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-gold/20" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              {/* Icon background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative flex justify-center mb-6">
                <div className="relative p-4 bg-gradient-to-br from-primary-500/20 to-blue-600/20 rounded-2xl group-hover:from-primary-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FiMapPin className="relative text-4xl text-primary-400 z-10" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-primary-400 transition-colors duration-300">Lokasi</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300 font-medium leading-relaxed">
                Jl. Parangtritis KM 6,5<br />
                Sewon, Bantul, Yogyakarta
              </p>
            </div>

            {/* Kontak Card */}
            <div className="group relative rounded-2xl p-8 overflow-hidden border border-gray-700/50 hover:border-gold/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-gold/20" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              {/* Icon background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative flex justify-center mb-6">
                <div className="relative p-4 bg-gradient-to-br from-gold/20 to-amber-500/20 rounded-2xl group-hover:from-gold/30 group-hover:to-amber-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FiMail className="relative text-4xl text-gold z-10" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-gold transition-colors duration-300">Kontak</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-gold to-amber-500 mx-auto mb-4"></div>
              <div className="space-y-2">
                <a 
                  href="mailto:bem@isi.ac.id" 
                  className="block text-gray-300 font-medium hover:text-gold transition-colors duration-300"
                >
                  bem@isi.ac.id
                </a>
                <a 
                  href="tel:+62274379133" 
                  className="block text-gray-300 font-medium hover:text-gold transition-colors duration-300"
                >
                  +62 274 379133
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
