<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @yield('seo', \View::make('seo-tags'))
    
    @livewireStyles

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    @if(get_setting('global_css'))
        <style>
            {!! get_setting('global_css') !!}
        </style>
    @endif

    @stack('head')
</head>

<body class="relative font-sans antialiased bg-background {{ Route::currentRouteName() }}">
    @stack('body_start')

    <main id="page-content w-full overflow-x-hidden" 
        @scroll.window.debounce.50ms="scrolled = window.scrollY > 70"
        @scroll.window.throttle.250ms="scrolled = window.scrollY > 70" 
        x-data="{
            scrolled: false,
        }"
    >
        <x-header wrapper-class="bg-gray-100"></x-header>

        @hasSection('content')
            @yield('content')
        @else
            {{ $slot }}
        @endif

        <x-footer wrapper-class="bg-gray-100"></x-footer>
    </main>

    @livewireScriptConfig
    
    {{-- <livewire:frontend.ecommerce.cart /> --}}
    
    <x-core::dashboard.system.alert id="general-alert" />
    <x-core::dashboard.system.alert-modal id="general-alert-modal" />
    <x-core::dashboard.system.notification-stream />

    @stack('footer')
</body>