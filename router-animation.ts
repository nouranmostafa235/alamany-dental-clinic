import {
  trigger,
  transition,
  style,
  animate,
  query,
  group
} from '@angular/animations';

export const routeAnimation = trigger('routeAnimation', [

  transition('login => sign-up', [

    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
      })
    ], { optional: true }),

    group([
      query(':leave', [
        animate('400ms ease-out',
          style({ transform: 'translateX(-40px)', opacity: 0 })
        )
      ], { optional: true }),

      query(':enter', [
        style({ transform: 'translateX(40px)', opacity: 0 }),
        animate('400ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        )
      ], { optional: true })
    ])
  ]),

  transition('login => sign-up', [

    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
      })
    ], { optional: true }),

    group([
      query(':leave', [
        animate('400ms ease-out',
          style({ transform: 'translateX(40px)', opacity: 0 })
        )
      ], { optional: true }),

      query(':enter', [
        style({ transform: 'translateX(-40px)', opacity: 0 }),
        animate('400ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        )
      ], { optional: true })
    ])
  ])

]);
