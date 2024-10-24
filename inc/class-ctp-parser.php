<?php

namespace CTP;

if (!defined('ABSPATH')) exit;

/***
 * This class is used to parse specific ctp functions that can be found
 * inside the columns of the submitted translations.
 * 
 * One example could be the following:
 * - function for plural translations: %_ctp_n(singular: 'Singular', plural: 'Plural')
 * 
 * So I have to parse this string "%_ctp_n(singular: 'Singular', plural: 'Plural')" into an array:
 * $plural_translation = ['singular' => 'Singular', 'plural' => 'Plural']
 */
class CTP_Parser {

    /**
     * Parse a string to check if it has the %_ctp_n() function.
     * 
     * If yes, parse the string, if not return false.
     */
    public static function parse_plural_translation(string $string): array|bool|string {
        $string     = (string) trim($string);

        // Init.
        $parsed     = (array) [];
        $function   = (string) '%_ctp_n';
        $ignore     = (array) ['(', ')', ','];

        // RegEx
        $r_validate = '/\(singular:\s?"[^"]*"(,\s?)plural:\s?"[^"]*"\)/';
        $r_split    = '/\(|singular:\s?|"[^"]*"|(,\s?)|plural:\s?|"[^"]*"|\)/';

        if (!str_contains($string, $function)) return false;

        if (!preg_match($r_validate, $string)) return false;

        $string = trim( str_replace($function, '', $string) );

        preg_match_all(
            $r_split,
            $string,
            $matches
        );

        $matches = $matches[0];

        if (!$matches || empty($matches)) return false;

        foreach ($matches as $n => $token) {
            $token = trim($token);

            // filter useless tokens.
            if (in_array($token, $ignore)) continue;

            // clean and build parsed tokens.
            if ($token === 'singular:' || $token === 'plural:') {
                $key = \str_replace(':', '', $token);

                $value = $matches[$n + 1];
                $value = substr($value, 1, strlen($value) - 2);

                $parsed[$key] = $value;
            }
        }

        if (!array_key_exists('singular', $parsed) || !array_key_exists('plural', $parsed)) {
            return false;
        }

        return $parsed;
    }
}