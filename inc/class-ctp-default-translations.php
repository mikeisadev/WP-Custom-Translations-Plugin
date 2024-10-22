<?php

namespace CTP;  

if (!defined('ABSPATH')) exit;

class CTP_Default_Translations {

    /**
     * Id types that can be generate to identify each translation,
     * 
     * uint = unique integer.
     * uuid = universally unique identifier.
     */
    private static $id_types = ['uint', 'uuid'];

    public static array $default_translations = [
        [
            'id'                            => null,
            'english_string'                => 'Add to cart',
            'italian_translation_string'    => 'Aggiungi al carrello'
        ],
        [   
            'id'                            => null,
            'english_string'                => 'Proceed to checkout',
            'italian_translation_string'    => 'Procedi al checkout'
        ],
        [   
            'id'                            => null,
            'english_string'                => 'Description',
            'italian_translation_string'    => 'Descrizione'
        ],
        [   
            'id'                            => null,
            'english_string'                => 'Price',
            'italian_translation_string'    => 'Prezzo'
        ],
        [
            'id'                            => null,
            'english_string'                => 'Quantity',
            'italian_translation_string'    => 'Quantità'
        ],
        [
            'id'                            => null,
            'english_string'                => 'Total',
            'italian_translation_string'    => 'Totale'
        ],
        [
            'id'                            => null,
            'english_string'                => 'Subtotal',
            'italian_translation_string'    => 'Subtotale'
        ],
        [   
            'id'                            => null,
            'english_string'                => 'Cart',
            'italian_translation_string'    => 'Carrello'
        ],
        [   
            'id'                            => null,
            'english_string'                => 'Checkout',
            'italian_translation_string'    => 'Checkout'
        ],
        [   
            'id'                            => null,
            'english_string'                => 'Product',
            'italian_translation_string'    => 'Prodotto'
        ]
    ];

    public static function get_default_translations(string $id_type = 'uint'): array {
        $id = '';
        $c = 1;

        $id_type = in_array($id_type, self::$id_types) ? $id_type : self::$id_types[0];

        foreach (self::$default_translations as $n => $translation) {
            switch ($id_type) {
                case 'uint': $id = (int) $c;                  break;
                case 'uuid': $id = (string) wp_generate_uuid4(); break;
            }

            self::$default_translations[$n]['id'] = $id;

            $c++;
        }

        return self::$default_translations;
    }
}