import * as React from 'react';

export default function MainPage() {
    return (
        <div className="w-full max-w-md">
            <svg
                width="100%"
                height="auto"
                viewBox="0 0 1277 232" // Add viewBox for better scaling
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="movingGradientt" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgba(30, 30, 30, 0.5)' }}> {/* Very Dark Gray */}
                            <animate attributeName="stop-color" values="rgba(30, 30, 30, 0.5); rgba(10, 10, 10, 0.5); rgba(30, 30, 30, 0.5)" dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" style={{ stopColor: 'rgba(10, 10, 10, 0.5)' }}> {/* Darker Gray */}
                            <animate attributeName="stop-color" values="rgba(10, 10, 10, 0.5); rgba(30, 30, 30, 0.5); rgba(10, 10, 10, 0.5)" dur="2s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>
                </defs>
                <path d="M0 0 C1.35135886 0.00084831 2.70271909 0.00036716 4.05407715 -0.00132751 C7.68773162 -0.00218095 11.32108314 0.01533766 14.95466781 0.03639436 C18.76495396 0.05527124 22.57524864 0.05692021 26.38557434 0.06047058 C33.58534044 0.06975895 40.7849683 0.09432878 47.9846738 0.12451905 C56.18789713 0.15816356 64.39112741 0.17457422 72.59440267 0.18960536 C89.45471151 0.22088162 106.31483016 0.27585301 123.17504883 0.34057617 C123.17504883 17.83057617 123.17504883 35.32057617 123.17504883 53.34057617 C117.40593018 53.35459473 117.40593018 53.35459473 111.52026367 53.36889648 C98.81958754 53.40264811 86.11908267 53.45798576 73.41853905 53.52447891 C65.71741771 53.56426985 58.01639856 53.59666201 50.31518555 53.61157227 C43.60193922 53.62458857 36.88891775 53.65155245 30.17579806 53.69518924 C26.62196814 53.71780486 23.06841556 53.73348682 19.51450729 53.73246002 C15.54484029 53.73157465 11.5757394 53.76183157 7.60620117 53.79467773 C6.4308783 53.78964737 5.25555542 53.784617 4.0446167 53.7794342 C-2.28808895 53.86061822 -5.93166043 54.2437227 -10.82495117 58.34057617 C-11.48495117 58.34057617 -12.14495117 58.34057617 -12.82495117 58.34057617 C-13.13432617 59.12432617 -13.44370117 59.90807617 -13.76245117 60.71557617 C-14.82495117 63.34057617 -14.82495117 63.34057617 -15.82495117 65.34057617 C-16.41601604 71.02389226 -16.09738534 75.4883462 -12.82495117 80.34057617 C-7.92828487 84.97952319 -3.50825169 86.58998573 3.18014526 86.59213257 C4.38539352 86.59751541 5.59064178 86.60289825 6.83241272 86.60844421 C8.80388527 86.60225822 8.80388527 86.60225822 10.81518555 86.59594727 C12.22014061 86.59869891 13.62509412 86.60237986 15.03004456 86.60691833 C18.05292742 86.61502144 21.07573634 86.61720089 24.098629 86.61497116 C28.8919143 86.61212998 33.68505313 86.62652329 38.478302 86.64395142 C52.10798923 86.69089135 65.73766716 86.71489006 79.36743164 86.72143555 C86.89746469 86.72520431 94.42733238 86.74338324 101.95729458 86.77652991 C106.70756443 86.79659115 111.45740323 86.79918912 116.20769763 86.78824973 C119.18579769 86.78561418 122.16365489 86.79978442 125.14169121 86.81833076 C127.14858672 86.82606022 129.15552892 86.81432499 131.16239929 86.801651 C150.48628037 86.97433568 167.4557389 93.59654677 181.17504883 107.34057617 C181.79766602 107.89229492 182.4202832 108.44401367 183.06176758 109.01245117 C195.75107676 120.53263299 201.36692429 137.26880739 202.39770508 153.94213867 C202.91342398 175.60233249 195.56234375 192.54419803 180.80004883 208.15307617 C161.55023826 226.63423111 138.23077887 227.82459767 113.05004883 227.91479492 C110.64827396 227.92954535 108.24649988 227.94442499 105.84472656 227.95942688 C100.84233936 227.98624421 95.84009877 227.99992739 90.83764648 228.00634766 C84.43729757 228.01728074 78.03850077 228.07926117 71.63861084 228.15306377 C66.69198311 228.20144293 61.74573327 228.21387416 56.79888916 228.21640968 C54.43858108 228.22362397 52.07827377 228.24403423 49.71820068 228.27811241 C46.42267844 228.32212367 43.13088532 228.3153848 39.83520508 228.29638672 C38.8698735 228.32043579 37.90454193 228.34448486 36.90995789 228.3692627 C31.44118718 228.27661086 28.66397779 227.41413494 24.71972656 223.51911926 C23.51279039 222.14820277 22.32998282 220.75557951 21.17504883 219.34057617 C20.05234673 218.06771233 18.92768864 216.79656772 17.80004883 215.52807617 C17.23543945 214.87194336 16.67083008 214.21581055 16.08911133 213.53979492 C13.82350314 210.93665735 11.50201331 208.38898893 9.17504883 205.84057617 C5.76604263 202.10348517 2.40809577 198.33216014 -0.90307617 194.50854492 C-2.43493 192.78053908 -3.98599031 191.08113731 -5.55932617 189.39135742 C-6.04602783 188.86727295 -6.53272949 188.34318848 -7.03417969 187.80322266 C-7.99195469 186.77458338 -8.953176 185.74913793 -9.91845703 184.72753906 C-12.94928733 181.46965575 -15.39521149 178.05915111 -17.82495117 174.34057617 C-17.04803641 174.33818782 -16.27112165 174.33579947 -15.47066402 174.33333874 C3.44210734 174.27417702 22.35474834 174.19861939 41.26738071 174.10486126 C50.41343088 174.05991481 59.55944222 174.02049748 68.70556641 173.99414062 C76.67825787 173.97115124 84.65082631 173.93774268 92.62342018 173.89187461 C96.84401802 173.86795507 101.06449411 173.84921799 105.28515816 173.84296227 C109.26033961 173.83690565 113.23520959 173.81688513 117.21027565 173.78630066 C118.66667771 173.77752965 120.12312049 173.77379592 121.57954788 173.77556801 C130.48329196 173.78297893 136.74030289 173.6912731 143.98754883 168.21557617 C146.89577517 164.39333584 147.9882397 161.13534374 148.17504883 156.34057617 C147.47222432 151.4208046 145.9620966 147.63530774 142.17504883 144.34057617 C138.0496781 141.59032902 135.29164627 141.21445434 130.44169617 141.20254517 C128.64840126 141.19436516 128.64840126 141.19436516 126.81887817 141.1860199 C124.84828934 141.18445641 124.84828934 141.18445641 122.83789062 141.18286133 C121.44146057 141.17819221 120.04503204 141.17304848 118.64860535 141.16746521 C115.63825816 141.15618271 112.62792088 141.14774884 109.61755943 141.14134598 C104.84573582 141.13064895 100.07398271 141.11039543 95.30220032 141.08822632 C81.73144801 141.02637268 68.16069853 140.97243447 54.58984375 140.93920898 C47.09683553 140.92078343 39.60394434 140.8917422 32.11102229 140.85120428 C28.15124762 140.83025311 24.19161972 140.81469418 20.23178673 140.812397 C16.49621991 140.81022763 12.76095774 140.79412915 9.02548409 140.76800728 C7.02436121 140.75754444 5.02317849 140.7615315 3.02203369 140.76618958 C-14.44448945 140.6082211 -30.0332346 136.22399007 -43.82495117 125.34057617 C-44.98317383 124.42985352 -44.98317383 124.42985352 -46.16479492 123.50073242 C-60.96803548 111.1267416 -68.89740696 94.01037669 -70.63745117 75.02807617 C-71.60257639 54.90418866 -65.6470293 37.5071237 -52.63745117 22.21557617 C-38.10524587 6.69646389 -20.98917349 -0.18234799 0 0 Z " fill="url(#movingGradientt)" transform="translate(823.824951171875,-0.340576171875)"/>
                <path d="M0 0 C27.06 0 54.12 0 82 0 C82 74.58 82 149.16 82 226 C64.84 226 47.68 226 30 226 C30 204.88 30 183.76 30 162 C4.92 162 -20.16 162 -46 162 C-44.38306857 158.76613714 -43.37050879 157.10390704 -40.98828125 154.609375 C-40.39901855 153.98659668 -39.80975586 153.36381836 -39.20263672 152.72216797 C-38.5788916 152.07135254 -37.95514648 151.42053711 -37.3125 150.75 C-36.02904981 149.39407871 -34.74648604 148.03731778 -33.46484375 146.6796875 C-32.85624512 146.03612305 -32.24764648 145.39255859 -31.62060547 144.72949219 C-29.82686866 142.81523616 -28.08607083 140.86342645 -26.375 138.875 C-23.22641112 135.21648542 -19.96239273 131.67014619 -16.6875 128.125 C-16.15882324 127.55249512 -15.63014648 126.97999023 -15.08544922 126.39013672 C-9.18070943 120.01225461 -9.18070943 120.01225461 -5.65185547 119.77294922 C-4.22359372 119.77344949 -2.79530668 119.78450151 -1.3671875 119.8046875 C-0.36764038 119.80770874 -0.36764038 119.80770874 0.65209961 119.81079102 C3.14313635 119.82126112 5.63407503 119.84918375 8.125 119.875 C13.69375 119.91625 19.2625 119.9575 25 120 C24.67 97.89 24.34 75.78 24 53 C14.55716659 63.48748241 14.55716659 63.48748241 5.3203125 74.15234375 C-0.22567765 80.6752574 -5.86520568 87.06659203 -11.71411133 93.31958008 C-14.7383702 96.57331665 -17.60000498 99.90240919 -20.375 103.375 C-24.60978848 108.65693617 -29.19871525 113.53876878 -33.84716797 118.45263672 C-37.21456839 122.0308973 -40.43367257 125.6556492 -43.5 129.5 C-48.27996646 135.48838495 -53.53219357 140.99684413 -58.78125 146.5703125 C-62.73316017 150.76808922 -66.52345773 155.08290505 -70.25439453 159.47753906 C-71.7304594 161.21559391 -73.20836838 162.95205423 -74.6875 164.6875 C-75.19982178 165.28868652 -75.71214355 165.88987305 -76.23999023 166.50927734 C-80.2823296 171.22502614 -84.47176965 175.78414842 -88.71411133 180.31958008 C-91.7383702 183.57331665 -94.60000498 186.90240919 -97.375 190.375 C-101.60293996 195.64839421 -106.18303692 200.52365016 -110.82519531 205.4284668 C-115.16005437 210.03322103 -119.21234533 214.76505216 -123.1328125 219.73046875 C-123.74898438 220.47941406 -124.36515625 221.22835937 -125 222 C-125.55850647 222.69744324 -126.11701294 223.39488647 -126.69244385 224.11346436 C-129.82519029 226.67463186 -131.77251453 226.4834123 -135.78808594 226.45410156 C-136.79845665 226.45497772 -136.79845665 226.45497772 -137.82923889 226.45587158 C-140.04814807 226.45309232 -142.26570154 226.42201114 -144.484375 226.390625 C-146.02564765 226.38316197 -147.5669298 226.37746933 -149.10821533 226.37347412 C-153.15922373 226.35822246 -157.20965585 226.31894539 -161.26043701 226.2746582 C-165.39620163 226.23369498 -169.53205962 226.2154609 -173.66796875 226.1953125 C-181.7789099 226.15245006 -189.88938321 226.08420515 -198 226 C-197.2392471 221.22859369 -195.74071661 219.20065737 -192.375 215.6875 C-191.45642475 214.71411366 -190.53845838 213.74015237 -189.62109375 212.765625 C-188.32365234 211.39664063 -188.32365234 211.39664063 -187 210 C-185.80357372 208.65371334 -184.61487217 207.30048143 -183.4375 205.9375 C-178.59115542 200.36477122 -173.62136519 194.90285407 -168.671875 189.421875 C-165.25694362 185.63525041 -161.85013474 181.84416383 -158.5 178 C-153.62856797 172.41020011 -148.6410485 166.92465102 -143.671875 161.421875 C-140.25694362 157.63525041 -136.85013474 153.84416383 -133.5 150 C-128.62856797 144.41020011 -123.6410485 138.92465102 -118.671875 133.421875 C-114.68295423 128.99878599 -110.72432093 124.55384995 -106.8125 120.0625 C-103.9673071 116.8248667 -101.07146164 113.6331371 -98.18359375 110.43359375 C-96.29151315 108.32488854 -94.42094242 106.20080199 -92.5625 104.0625 C-88.91062947 99.86835635 -85.15733816 95.76905708 -81.41015625 91.66015625 C-78.82761116 88.80972966 -76.29344897 85.92174108 -73.76953125 83.01953125 C-69.46130252 78.10263444 -65.05313844 73.27360968 -60.671875 68.421875 C-57.25694362 64.63525041 -53.85013474 60.84416383 -50.5 57 C-45.62856797 51.41020011 -40.6410485 45.92465102 -35.671875 40.421875 C-31.68295423 35.99878599 -27.72432093 31.55384995 -23.8125 27.0625 C-21.72788836 24.69035571 -19.61571356 22.34443935 -17.5 20 C-11.56327991 13.41820336 -5.76869664 6.73014608 0 0 Z " fill="url(#movingGradientt)" transform="translate(198,0)"/>
                <path d="M0 0 C27.06 0 54.12 0 82 0 C93.88461538 12.96503497 93.88461538 12.96503497 98.2578125 18.0078125 C100.31500399 20.36020635 102.40596915 22.68034966 104.5 25 C107.17048344 27.95869751 109.82298058 30.92926472 112.4375 33.9375 C115.24822525 37.16559512 118.115799 40.33738443 121 43.5 C124.45328153 47.28662998 127.86099051 51.1047632 131.22265625 54.97265625 C133.29359487 57.33489173 135.39512848 59.66795853 137.5 62 C140.17048344 64.95869751 142.82298058 67.92926472 145.4375 70.9375 C148.24822525 74.16559512 151.115799 77.33738443 154 80.5 C157.45328153 84.28662998 160.86099051 88.1047632 164.22265625 91.97265625 C166.29359487 94.33489173 168.39512848 96.66795853 170.5 99 C173.17048344 101.95869751 175.82298058 104.92926472 178.4375 107.9375 C181.24822525 111.16559512 184.115799 114.33738443 187 117.5 C190.45575413 121.28934126 193.8652289 125.11083698 197.23046875 128.98046875 C200.77576954 133.02665089 204.39458999 137.00743187 208 141 C212.76786975 146.27985576 217.51512218 151.57291806 222.1875 156.9375 C225.0326929 160.1751333 227.92853836 163.3668629 230.81640625 166.56640625 C232.70848685 168.67511146 234.57905758 170.79919801 236.4375 172.9375 C239.24822525 176.16559512 242.115799 179.33738443 245 182.5 C248.45328153 186.28662998 251.86099051 190.1047632 255.22265625 193.97265625 C257.29359487 196.33489173 259.39512848 198.66795853 261.5 201 C264.77649549 204.63131057 268.02132012 208.28616356 271.2265625 211.98046875 C272.5395571 213.47566305 273.87052487 214.95511651 275.2109375 216.42578125 C275.94570313 217.23402344 276.68046875 218.04226562 277.4375 218.875 C278.11683594 219.61492187 278.79617188 220.35484375 279.49609375 221.1171875 C281 223 281 223 281 225 C271.96812531 225.32626039 262.93831509 225.57404219 253.90180683 225.72537041 C249.70413092 225.7980552 245.51052067 225.89636727 241.31518555 226.05615234 C211.93848356 227.14624368 211.93848356 227.14624368 204.9855957 222.01245117 C202.09313408 219.23880425 199.92521491 216.23630872 197.99153137 212.73674011 C196.48445335 210.09698214 194.52837912 207.86997873 192.5625 205.5625 C191.86253906 204.68722656 191.16257812 203.81195313 190.44140625 202.91015625 C186.84883403 198.62781016 182.99282919 194.6065998 179.15258789 190.54711914 C175.01398343 186.14932822 171.17261146 181.59700541 167.40625 176.875 C164.40257995 173.28619942 161.21525846 169.8987933 158 166.5 C153.22821617 161.45583104 148.73816007 156.30605144 144.40625 150.875 C141.40257995 147.28619942 138.21525846 143.8987933 135 140.5 C130.22821617 135.45583104 125.73816007 130.30605144 121.40625 124.875 C118.4025791 121.28619841 115.21524703 117.89880547 112 114.5 C107.21104408 109.43735325 102.69833775 104.26882952 98.34765625 98.8203125 C94.4274265 94.11081852 90.19880954 89.69029491 86.0078125 85.22265625 C83.15453222 82.17862987 80.38811991 79.07033123 77.6640625 75.91015625 C75.68459874 73.63795489 73.6541683 71.41540128 71.625 69.1875 C66.93151748 63.92318852 62.46608897 58.45855318 58 53 C57.67 75.11 57.34 97.22 57 120 C67.78615814 119.64545818 67.78615814 119.64545818 78.56811523 119.18920898 C89.2628702 118.8892016 89.2628702 118.8892016 93.98950195 121.91162109 C96.2509622 124.16181428 98.13278782 126.41883774 100 129 C101.09347325 130.25936503 102.19580456 131.51117987 103.3125 132.75 C103.86808594 133.39710938 104.42367187 134.04421875 104.99609375 134.7109375 C107.56871258 137.6496405 110.21980229 140.5109991 112.875 143.375 C113.90896678 144.49338548 114.94282154 145.61187454 115.9765625 146.73046875 C117.45652099 148.3316348 118.93704848 149.93222436 120.42089844 151.52978516 C121.70203368 152.9112837 122.9762282 154.29920928 124.25 155.6875 C124.97703125 156.47511719 125.7040625 157.26273438 126.453125 158.07421875 C128 160 128 160 128 162 C102.92 162 77.84 162 52 162 C52 183.12 52 204.24 52 226 C34.84 226 17.68 226 0 226 C0 151.42 0 76.84 0 0 Z " fill="url(#movingGradientt)" transform="translate(550,0)"/>
                <path d="M0 0 C18.69516168 -0.16043524 18.69516168 -0.16043524 26.73632812 -0.1953125 C32.1981585 -0.21911559 37.65971768 -0.24710715 43.12133789 -0.30175781 C47.53044903 -0.34559474 51.93926887 -0.36921594 56.34858131 -0.37950897 C58.02090851 -0.3868331 59.69322189 -0.40113299 61.3654232 -0.42292023 C81.55037515 -0.67517072 96.94904393 5.26394805 112 19 C125.57834479 32.36984813 132.08137119 49.85737178 132.375 68.625 C132.35355009 82.2343373 128.93256872 93.84651213 123.171875 106.109375 C121.74952993 109.09797033 121.74952993 109.09797033 122 113 C123.62394994 115.95429762 123.62394994 115.95429762 125.75 119.0625 C135.2675296 133.90516473 136.304961 148.96786895 136.1953125 166.13671875 C136.19157487 167.86977473 136.18873145 169.60283286 136.18673706 171.33589172 C136.1791596 175.86170451 136.15956281 180.38738563 136.1373291 184.91314697 C136.11311297 190.3623762 136.10406162 195.81164985 136.09242249 201.26091766 C136.0731341 209.50736956 136.03477077 217.75353348 136 226 C118.51 226 101.02 226 83 226 C82.96261719 220.9675 82.92523438 215.935 82.88671875 210.75 C82.85642193 207.55074782 82.82526297 204.35155013 82.79101562 201.15234375 C82.73680787 196.08092074 82.68569357 191.0096055 82.65356445 185.93798828 C82.62744365 181.84644196 82.58698018 177.75526008 82.53681374 173.66394043 C82.52020409 172.10759027 82.5086532 170.55117715 82.50238609 168.99475098 C82.95088145 156.36377839 82.95088145 156.36377839 77.54862976 145.46240234 C72.33302718 140.93059215 68.53333845 140.83730613 61.86865234 140.79467773 C60.92226395 140.78477814 59.97587555 140.77487854 59.00080872 140.76467896 C55.86254404 140.73300978 52.72426421 140.70828512 49.5859375 140.68359375 C47.41402791 140.6630289 45.24212236 140.64203256 43.07022095 140.62062073 C37.34589915 140.56535161 31.62154095 140.51596369 25.89715576 140.46777344 C19.03306077 140.40877555 12.16903249 140.342521 5.30499268 140.27747345 C-5.12996423 140.17940306 -15.56496337 140.09058861 -26 140 C-26 168.38 -26 196.76 -26 226 C-43.49 226 -60.98 226 -79 226 C-79 179.8 -79 133.6 -79 86 C-68.46964844 85.97421875 -57.93929688 85.9484375 -47.08984375 85.921875 C-40.42250738 85.8967115 -33.75519998 85.87054563 -27.08789062 85.83984375 C-16.50301304 85.79128892 -5.91823181 85.74685111 4.66674805 85.72900391 C12.37577942 85.71598696 20.08461502 85.68902127 27.79353613 85.64538693 C31.87444482 85.62277297 35.95511204 85.60708927 40.03608894 85.60811615 C43.88002794 85.60886281 47.72343317 85.59091014 51.56723404 85.55883217 C52.97525662 85.55033803 54.38333911 85.54857999 55.79137611 85.55419731 C66.12074171 85.64844865 66.12074171 85.64844865 75 81 C78.71942049 76.23151219 79.66839433 72.46260847 79.375 66.4296875 C78.77240429 62.52536946 77.60210094 59.95429323 75 57 C67.65286233 52.03371263 60.11781451 52.39555731 51.5625 52.390625 C50.07175924 52.37562425 48.58103498 52.35889315 47.09033203 52.34051514 C43.19088935 52.2970412 39.29167078 52.27688731 35.39202881 52.26177979 C30.70026749 52.23867474 26.00875082 52.18626838 21.31718445 52.13883972 C14.21139286 52.07025229 7.10630195 52.03862121 0 52 C0 34.84 0 17.68 0 0 Z " fill="url(#movingGradientt)" transform="translate(386,0)"/>
                <path d="M0 0 C17.49 0 34.98 0 53 0 C53 58.74 53 117.48 53 178 C35.51 178 18.02 178 0 178 C0 165.13 0 152.26 0 139 C-40.26 139 -80.52 139 -122 139 C-122 168.04 -122 197.08 -122 227 C-133.50004471 223.16665176 -141.91797332 219.00499146 -151 211 C-151.763125 210.33226562 -152.52625 209.66453125 -153.3125 208.9765625 C-165.29542498 197.78417771 -174.26624111 182.32068728 -175.17837906 165.76169968 C-175.2451222 161.99433682 -175.24794205 158.23000768 -175.22705078 154.46240234 C-175.22648553 153.02252205 -175.22680545 151.58264119 -175.22793579 150.14276123 C-175.22850587 146.26326035 -175.21680795 142.38388502 -175.20278788 138.50441313 C-175.19022252 134.43919747 -175.18910546 130.37397842 -175.18673706 126.30874634 C-175.18053927 118.62378693 -175.16415163 110.93888493 -175.14403808 103.25395072 C-175.12162594 94.49935901 -175.11067232 85.74476445 -175.10064721 76.99015117 C-175.07978376 58.99339503 -175.04312895 40.9967175 -175 23 C-157.51 23 -140.02 23 -122 23 C-122 43.79 -122 64.58 -122 86 C-81.74 86 -41.48 86 0 86 C0 57.62 0 29.24 0 0 Z " fill="url(#movingGradientt)" transform="translate(1222,0)"/>
                <path d="M0 0 C17.49 0 34.98 0 53 0 C53 14.19 53 28.38 53 43 C35.51 43 18.02 43 0 43 C0 28.81 0 14.62 0 0 Z " fill="url(#movingGradientt)" transform="translate(1222,184)" />
                <path d="M0 0 C13.86 0 27.72 0 42 0 C42 17.49 42 34.98 42 53 C28.14 53 14.28 53 0 53 C0 35.51 0 18.02 0 0 Z " fill="url(#movingGradientt)" transform="translate(959,0)" />
                <path d="M0 0 C13.86 0 27.72 0 42 0 C42 17.16 42 34.32 42 52 C28.14 52 14.28 52 0 52 C0 34.84 0 17.68 0 0 Z " fill="url(#movingGradientt)" transform="translate(333,0)" />
                <path d="M0 0 C6.6 0 13.2 0 20 0 C20 17.49 20 34.98 20 53 C13.4 53 6.8 53 0 53 C0 35.51 0 18.02 0 0 Z " fill="url(#movingGradientt)" transform="translate(1007,0)" />
                <path d="M0 0 C6.27 0 12.54 0 19 0 C19 17.16 19 34.32 19 52 C12.73 52 6.46 52 0 52 C0 34.84 0 17.68 0 0 Z " fill="#url(#movingGradientt)" transform="translate(307,0)" />
            </svg>
        </div>
    );
}