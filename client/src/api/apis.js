import axios from 'axios';

const BASE_URL = 'http://localhost:1000/api/triptrack';

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// mes naudosime interceptorius, kad pridėti tokeną prie užklausų, kurios yra siunčiamos į serverį ir gauti atsakymą iš serverio
// jeigu nenaudusime interceptoriaus, tai mes turėsime kiekvieną kartą pridėti tokeną prie užklausos ir gauti atsakymą iš serverio
apiClient.interceptors.request.use(
  // config yra objektas, kuris turi visas užklausos savybes, kurios yra siunčiamos į serverį
  (config) => {
    // Jeigu nenurodome tokeno, tai vartotojas nebus prisijungęs ir nebus galima pasiekti privačių puslapių
    // Vartotojas siunčia prisijungimo duomenis (vartotojo vardą ir slaptažodį) į serverį.
    // Serveris patikrina credentials. Jei jie galioja, serveris generuoja unikalų naudotojo token.
    // Serveris siunčia token atgal į naudotojo web brwoser.
    // Web browser išsaugo token localStorage, naudodama localStorage.setItem('token', token).
    // Vėlesnėse užklausose į serverį, o vėliau browser gauna token iš localStorage naudodama const token = localStorage.getItem('token') ir įtraukia jį į užklausą.
    // Serveris patikrina token, kad patikrintų naudotojo tapatybę ir teises.

    const token = localStorage.getItem('token');
    // jeigu token yra, tai pridedame tokeną prie užklausos
    if (token) {
      // iš config.headers.Authorization pridedame tokeną prie užklausos ir nurodome, kad tokenas yra Bearer tokena
      // header yra vienas iš užklausos savybių, kuris yra naudojamas, kad siųsti papildomus duomenis kartu su užklausa
      config.headers.Authorization = `Bearer ${token}`;
    }
    // grąžiname config objektą, kad jis būtu naudojamas užklausos siuntimui
    return config;
  },
  (error) => {
    // grąžiname klaidą, kad būtu galima ją apdoroti naudojame Promises, nes axios naudoja Promises užklausoms siųsti ir gauti atsakymą
    return Promise.reject(error);
  },
);

export const registerUser = (userData) => {
  return apiClient.post('/users/register', userData);
};

export const fetchUserData = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    console.log('Response:', response); // log the entire response
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};