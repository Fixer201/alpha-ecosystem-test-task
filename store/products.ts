import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    isFavorite: boolean;
}

interface ProductsState {
    products: Product[];
    isLoading: boolean;
    addProduct: (product: Omit<Product, 'id' | 'isFavorite'>) => void;
    removeProduct: (id: string) => void;
    updateProduct: (id: string, product: Partial<Omit<Product, 'id' | 'isFavorite'>>) => void;
    getProductById: (id: string) => Product | undefined;
    toggleFavorite: (id: string) => void;
    fetchProducts: () => Promise<void>;
    setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProductsState>()(
    persist(
        (set, get) => ({
            products: [],
            isLoading: false,

            fetchProducts: async () => {
                set({isLoading: true});
                try {
                    const currentProducts = get().products;

                    // Разделяем кастомные продукты (ID > 1000) от продуктов API
                    const customProducts = currentProducts.filter(p => parseInt(p.id) > 1000);

                    // Создаём карту для быстрого поиска isFavorite статуса
                    const favoritesMap = new Map(
                        currentProducts.map(p => [p.id, p.isFavorite])
                    );

                    const response = await fetch('https://fakestoreapi.com/products');
                    const data = await response.json();

                    // Продукты из API с сохранением isFavorite
                    const apiProducts: Product[] = data.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        description: item.description,
                        price: `$${item.price}`,
                        image: item.image,
                        category: item.category,
                        // Сохраняем isFavorite если товар уже был в списке
                        isFavorite: favoritesMap.get(item.id.toString()) || false,
                    }));

                    // Объединяем: API продукты + кастомные
                    const mergedProducts = [...apiProducts, ...customProducts];

                    set({products: mergedProducts, isLoading: false});
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                    set({isLoading: false});
                }
            },

            setProducts: (products) => set({products}),

            addProduct: (product) =>
                set((state) => ({
                    products: [
                        ...state.products,
                        {
                            ...product,
                            id: Date.now().toString(),
                            isFavorite: false,
                        },
                    ],
                })),

            removeProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                })),

            updateProduct: (id, updatedProduct) =>
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? {...p, ...updatedProduct} : p
                    ),
                })),

            getProductById: (id) => {
                return get().products.find((p) => p.id === id);
            },

            toggleFavorite: (id) =>
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? {...p, isFavorite: !p.isFavorite} : p
                    ),
                })),
        }),
        {
            name: 'products-storage',
        }
    )
);
